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

  public static SignInWithDIDAndPWd(
    sessionItem: ISessionItem,
    storePassword: string
  ) {
    this.lockUser(this.key(sessionItem.did), sessionItem, storePassword)
    SessionService.saveSessionItem(sessionItem)
  }

  public static async DIDlogin(did: string) {
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
        return {
          accountType: userData.accountType,
          did: userData.did,
          firstName: userData.firstName,
          lastName: userData.lastName,
          hiveHost: userData.hiveHost,
          email: userData.email,
          userToken: '',
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

  public static async SignIn3rdParty(
    id: string,
    fname: string,
    lname: string,
    token: string,
    service: AccountType,
    email: string,
    credential: string,
    storePassword: string
  ) {
    let sessionItem: ISessionItem

    let newDID = await this.generateTemporaryDID(service, credential)
    sessionItem = {
      did: newDID.did,
      accountType: service,
      isDIDPublished: false,
      firstName: fname,
      lastName: lname,
      hiveHost: `${process.env.REACT_APP_TUUM_TECH_HIVE}`,
      userToken: token,
      mnemonics: newDID.mnemonic,
      email: email,
      onBoardingCompleted: false,
    }

    // add new user to the tuum.tech vault
    const add_user_script = {
      name: 'add_user',
      params: {
        firstName: fname,
        lastName: lname,
        full_name: fname + ' ' + lname,
        email: email,
        status: 'CONFIRMED',
        code: 1,
        did: newDID.did,
        hiveHost: sessionItem.hiveHost,
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID,
      },
    }
    let response = await ScriptService.runTuumTechScript(add_user_script)
    console.log('=====>response', response)

    console.log(sessionItem)
    this.lockUser(this.key(newDID.did), sessionItem, storePassword)
    SessionService.saveSessionItem(sessionItem)
  }

  private static getCredentialType(service: AccountType): CredentialType {
    if (service === AccountType.Facebook) return CredentialType.Facebook
    if (service === AccountType.Twitter) return CredentialType.Twitter
    if (service === AccountType.Google) return CredentialType.Google
    if (service === AccountType.Linkedin) return CredentialType.Linkedin
    throw Error('Invalid account type')
  }

  private static async generateTemporaryDID(
    service: AccountType,
    credential: string
  ): Promise<IDID> {
    console.log('Generating temporary DID')
    let newDID = await DidService.generateNew()
    let temporaryDocument = await DidService.temporaryDidDocument(newDID)

    let vc = DidcredsService.generateVerifiableCredential(
      newDID.did,
      this.getCredentialType(service),
      credential
    )

    DidService.addVerfiableCredentialToDIDDocument(temporaryDocument, vc)

    DidDocumentService.updateUserDocument(temporaryDocument)

    // let requestPub = await DidService.generatePublishRequest(temporaryDocument)

    // let response = await AssistService.publishDocument(newDID.did, requestPub)

    // window.localStorage.setItem(
    //   `temporary_${newDID.did.replace('did:elastos:', '')}`,
    //   JSON.stringify({
    //     mnemonic: newDID.mnemonic,
    //   })
    // )

    // window.localStorage.setItem(
    //   `publish_${response.confirmationId}`,
    //   JSON.stringify({
    //     confirmationId: response.confirmationId,
    //     status: response.requestStatus,
    //   })
    // )

    return newDID
  }

  static getLoggedUser(): ISessionItem {
    return SessionService.getSession()
  }

  private static lockUser(
    key: string,
    instance: ISessionItem,
    storePassword: string
  ) {
    // clear prev data
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i)
      if (key && key.startsWith('user_')) {
        window.localStorage.removeItem(key)
      }
      if (key && key.startsWith('temporary_')) {
        window.localStorage.removeItem(key)
      }
    }

    console.log('======>localUserData', key, instance, storePassword)
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

  public static LoginWithPassword(
    did: string,
    storePassword: string
  ): ISessionItem | null {
    try {
      let instance = this.unlockUser(this.key(did), storePassword)
      SessionService.saveSessionItem(instance)
      return instance
    } catch (error) {
      return null
    }
  }

  public static setOnBoardingComplted() {
    let sessionItem = this.getLoggedUser()
    if (sessionItem) {
      sessionItem.onBoardingCompleted = true
      window.sessionStorage.setItem(
        'session_instance',
        JSON.stringify(sessionItem, null, '')
      )
    }
  }

  public static Login(did: string, storePassword: string) {
    let instance = this.unlockUser(this.key(did), storePassword)
    SessionService.saveSessionItem(instance)
  }

  public static async logout() {
    let sessionItem = this.getLoggedUser()
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
      console.log('=====>response', response)
    }
    window.localStorage.clear()
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
    window.sessionStorage.clear()
    window.sessionStorage.setItem(
      'session_instance',
      JSON.stringify(item, null, '')
    )
  }

  static Logout() {
    window.sessionStorage.removeItem('session_instance')
  }
}
