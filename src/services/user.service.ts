import { AssistService } from './assist.service'
import { DidService, IDID } from './did.service'
import { CredentialType, DidcredsService } from './didcreds.service'
import { DidDocumentService } from './diddocument.service'
import { ScriptService } from './script.service'

const CryptoJS = require('crypto-js')

export enum AccountType {
  DID = 'DID',
  Linkedin = 'Linkedin',
  Facebook = 'Facebook',
  Google = 'Google',
  Twitter = 'Twitter',
  Email = 'Email',
}

export interface ISessionItem {
  hiveHost: string
  userToken: string
  accountType: AccountType
  did: string
  firstName: string
  lastName: string
  email?: string
  isDIDPublished: boolean
  mnemonics: string
  onBoardingCompleted: boolean
  tutorialCompleted: boolean
}

export interface ITemporaryDID {
  mnemonic: string
  confirmationId: string
}

export interface UserData {
  did: string
  name: string
  data: string
}

export interface SignInDIDData {
  firstName: string
  lastName: string
  did: string
  hiveHost: string
  userToken: string
  isDIDPublished: boolean
}

export class UserService {
  private static key(did: string): string {
    return `user_${did.replace('did:elastos:', '')}`
  }

  private static getCredentialType(service: AccountType): CredentialType {
    if (service === AccountType.Facebook) return CredentialType.Facebook
    if (service === AccountType.Twitter) return CredentialType.Twitter
    if (service === AccountType.Google) return CredentialType.Google
    if (service === AccountType.Linkedin) return CredentialType.Linkedin
    if (service === AccountType.Email) return CredentialType.Email
    if (service === AccountType.DID) return CredentialType.DID
    throw Error('Invalid account type')
  }

  private static async generateTemporaryDID(
    service: AccountType,
    credential: string
  ): Promise<IDID> {
    // this.clearPrevLocalData()

    console.log('Generating temporary DID')
    let newDID = await DidService.generateNew()
    let temporaryDocument = await DidService.temporaryDidDocument(newDID)

    let vc = DidcredsService.generateVerifiableCredential(
      newDID.did,
      this.getCredentialType(service),
      credential
    )

    DidService.addVerfiableCredentialToDIDDocument(temporaryDocument, vc)

    DidService.sealDIDDocument(newDID, temporaryDocument)

    let requestPub = await DidService.generatePublishRequest(temporaryDocument)

    let response = await AssistService.publishDocument(newDID.did, requestPub)

    window.localStorage.setItem(
      `temporary_${newDID.did.replace('did:elastos:', '')}`,
      JSON.stringify({
        mnemonic: newDID.mnemonic,
      })
    )

    return newDID
  }

  private static lockUser(
    key: string,
    instance: ISessionItem,
    storePassword: string
  ) {
    console.log('localUserData', key, instance, storePassword)
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(instance),
      storePassword
    ).toString()
    let localUserData: UserData = {
      name: instance.firstName + ' ' + instance.lastName,
      did: instance.did,
      data: encrypted,
    }
    let json = JSON.stringify(localUserData, null, '')
    window.localStorage.setItem(key, json)
  }

  private static unlockUser(key: string, storePassword: string): ISessionItem {
    console.log('Unlocking user', key)
    let item = window.localStorage.getItem(key)

    if (!item) throw new Error('User not found')

    try {
      let userData: UserData = JSON.parse(item)
      console.log('user data', userData)
      let decrypted = CryptoJS.AES.decrypt(userData.data, storePassword)
      console.log('decrypted', decrypted)
      let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
      console.log('instance', instance)
      if (!instance && !instance.userToken)
        throw new Error('Incorrect password')
      return instance
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public static getSignedUsers(): string[] {
    let response: string[] = []
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i)
      if (key && key.startsWith('user_')) {
        response.push(key.replace('user_', 'did:elastos:'))
      }
    }
    return response
  }

  public static GetUserSession(): ISessionItem {
    let item = window.sessionStorage.getItem('session_instance')

    if (!item) {
      throw Error('Not logged in')
    }

    return JSON.parse(item)
  }

  public static LockWithDIDAndPWd(
    sessionItem: ISessionItem,
    storePassword: string
  ) {
    this.lockUser(this.key(sessionItem.did), sessionItem, storePassword)
    SessionService.saveSessionItem(sessionItem)
  }

  public static async SearchUserWithDID(did: string) {
    const get_user_by_did_script = {
      name: 'get_user_by_did',
      params: {
        did,
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID,
      },
    }
    let response: any = await ScriptService.runTuumTechScript(
      get_user_by_did_script
    )
    const { data, meta } = response
    if (meta.code === 200 && meta.message === 'OK') {
      const { get_user_by_did } = data
      if (
        get_user_by_did &&
        get_user_by_did.items &&
        get_user_by_did.items.length > 0
      ) {
        const userData = get_user_by_did.items[0]
        const pSignedUsers = this.getSignedUsers()
        const isDIDPublished = await DidService.isDIDPublished(userData.did)

        return {
          accountType: userData.accountType,
          did: userData.did,
          firstName: userData.firstName,
          lastName: userData.lastName,
          hiveHost: userData.hiveHost,
          email: userData.email,
          userToken: userData.userToken,
          isDIDPublished: isDIDPublished ? isDIDPublished : false,
          alreadySigned:
            pSignedUsers &&
            pSignedUsers.length > 0 &&
            pSignedUsers.includes(data.did),
        }
      } else {
        return null
      }
    } else {
      throw Error('Error while searching user by did')
    }
  }

  public static async CreateNewUser(
    firstName: string,
    lastName: string,
    token: string,
    service: AccountType,
    email: string,
    credential: string,
    storePassword: string,
    newDidStr: string,
    newMnemonicStr: string,
    hiveHostStr: string
  ) {
    let sessionItem: ISessionItem

    let did = newDidStr
    let mnemonic = newMnemonicStr

    if (!did || did === '') {
      const newDid = await this.generateTemporaryDID(service, credential)
      did = newDid.did
      mnemonic = newDid.mnemonic
    }

    sessionItem = {
      did: did,
      accountType: service,
      isDIDPublished: await DidService.isDIDPublished(did),
      firstName: firstName,
      lastName: lastName,
      hiveHost:
        hiveHostStr === ''
          ? `${process.env.REACT_APP_TUUM_TECH_HIVE}`
          : hiveHostStr,
      userToken: token,
      mnemonics: mnemonic,
      email: email,
      onBoardingCompleted: false,
      tutorialCompleted: false,
    }

    // add new user to the tuum.tech vault
    if (service === AccountType.Email) {
      const add_user_script = {
        name: 'update_user_did_info',
        params: {
          email: email,
          code: credential,
          did: did,
          hiveHost: sessionItem.hiveHost,
          accountType: service,
          userToken: token,
          tutorialCompleted: false,
        },
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID,
        },
      }
      let response = await ScriptService.runTuumTechScript(add_user_script)
      console.log('update_user_did_info script response', response)
    } else {
      const add_user_script = {
        name: 'add_user',
        params: {
          firstName: firstName,
          lastName: lastName,
          name: firstName + ' ' + lastName,
          email: email,
          status: 'CONFIRMED',
          code: 1,
          did: did,
          hiveHost: sessionItem.hiveHost,
          accountType: service,
          userToken: token,
          tutorialCompleted: false,
        },
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID,
        },
      }
      let response = await ScriptService.runTuumTechScript(add_user_script)
      console.log('add_user script response', response)
    }

    console.log(sessionItem)
    this.lockUser(this.key(did), sessionItem, storePassword)
    SessionService.saveSessionItem(sessionItem)
  }

  public static setOnBoardingComplted() {
    let sessionItem = this.GetUserSession()
    if (sessionItem) {
      sessionItem.onBoardingCompleted = true
      window.sessionStorage.setItem(
        'session_instance',
        JSON.stringify(sessionItem, null, '')
      )
    }
  }

  public static updateSession(sessionItem: ISessionItem) {
    window.sessionStorage.setItem(
      'session_instance',
      JSON.stringify(sessionItem, null, '')
    )
  }

  public static clearPrevLocalData() {
    console.log('=====>clearPrevLocalData')
    const removeKeys = []
    for (let i = 0; i < window.localStorage.length; i++) {
      const key = window.localStorage.key(i)
      if (
        key &&
        key !== '' &&
        (key.startsWith('temporary_') ||
          key.startsWith('user_') ||
          key.startsWith('publish_'))
      ) {
        removeKeys.push(key)
      }
    }
    for (let i = 0; i < removeKeys.length; i++) {
      window.localStorage.removeItem(removeKeys[i])
    }
  }

  public static UnLockWithDIDAndPWd(did: string, storePassword: string) {
    try {
      let instance = this.unlockUser(this.key(did), storePassword)
      SessionService.saveSessionItem(instance)
      return instance
    } catch (error) {
      return null
    }
  }

  public static async logout() {
    let sessionItem = this.GetUserSession()
    if (!sessionItem.onBoardingCompleted) {
      // remove this DID from tuum.tech vault
      const delete_user_by_did = {
        name: 'delete_user_by_did',
        params: {
          did: sessionItem.did,
        },
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID,
        },
      }
      let response = await ScriptService.runTuumTechScript(delete_user_by_did)
      console.log('delete_user_by_did script response', response)
    }

    // this.clearPrevLocalData()
    SessionService.Logout()
  }
}

//To be
class SessionService {
  static getSession(): ISessionItem {
    let item = window.sessionStorage.getItem('session_instance')

    if (!item) {
      throw Error('Not logged in')
    }

    let instance = JSON.parse(item)
    return instance
  }

  static saveSessionItem(item: ISessionItem) {
    window.sessionStorage.setItem(
      'session_instance',
      JSON.stringify(item, null, '')
    )
  }

  static Logout() {
    window.sessionStorage.clear()
    window.location.href = '/create-profile'
  }
}
