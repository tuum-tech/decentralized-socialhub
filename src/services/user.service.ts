import { alertError } from 'src/utils/notify';

import { AssistService } from './assist.service';
import { DidService, IDID, PublishRequestOperation } from './did.service';
import { DidDocumentService } from './diddocument.service';
import { showNotify } from 'src/utils/notify';
import {
  TuumTechScriptService,
  UserVaultScriptService
} from './script.service';
import { Guid } from 'guid-typescript';

const CryptoJS = require('crypto-js');

export enum AccountType {
  DID = 'DID',
  Linkedin = 'Linkedin',
  Facebook = 'Facebook',
  Google = 'Google',
  Twitter = 'Twitter',
  Email = 'Email'
}

export interface ITemporaryDID {
  mnemonic: string;
  confirmationId: string;
}

export interface UserData {
  did: string;
  name: string;
  data: string;
}

export interface SignInDIDData {
  name: string;
  did: string;
  hiveHost: string;
  userToken: string;
  isDIDPublished: boolean;
}

export class UserService {
  private static key(did: string): string {
    return `user_${did.replace('did:elastos:', '')}`;
  }

  private static async generateTemporaryDID(
    service: AccountType,
    credential: string,
    name: string
  ): Promise<IDID> {
    let newDID = await DidService.generateNew();
    let temporaryDocument = await DidService.genereteNewDidDocument(newDID);

    let nameVc = DidService.generateSelfVerifiableCredential(
      newDID,
      'name',
      [''],
      name
    );
    await DidService.addVerfiableCredentialToDIDDocument(
      temporaryDocument,
      nameVc
    );

    // let nameVc = DidService.generateSelfVerifiableCredential(newDID, "name", ["BasicProfileCredential"], name)
    // await DidService.addVerfiableCredentialToDIDDocument(temporaryDocument, nameVc)

    // let credentialType: CredentialType = CredentialType.DID
    // if (service == AccountType.Email) credentialType = CredentialType.Email
    // if (service == AccountType.Facebook) credentialType = CredentialType.Facebook
    // if (service == AccountType.Google) credentialType = CredentialType.Google
    // if (service == AccountType.Linkedin) credentialType = CredentialType.Linkedin
    // if (service == AccountType.Twitter) credentialType = CredentialType.Twitter

    // if (credentialType !== CredentialType.DID){
    //   let serviceVc = await DidcredsService.generateVerifiableCredential(newDID.did, credentialType, credential)
    //   await DidService.addVerfiableCredentialToDIDDocument(temporaryDocument, serviceVc)
    // }

    let signedDocument = DidService.sealDIDDocument(newDID, temporaryDocument);
    DidDocumentService.updateUserDocument(signedDocument);

    let requestPub = await DidService.generatePublishRequest(
      signedDocument,
      newDID,
      PublishRequestOperation.Create
    );
    await AssistService.publishDocument(newDID.did, requestPub);

    window.localStorage.setItem(
      `temporary_${newDID.did.replace('did:elastos:', '')}`,
      JSON.stringify({
        mnemonic: newDID.mnemonic
      })
    );

    return newDID;
  }

  private static lockUser(key: string, instance: ISessionItem) {
    if (!instance.mnemonics || instance.mnemonics === '') {
      instance.mnemonics =
        window.localStorage.getItem(
          `temporary_${instance.did.replace('did:elastos:', '')}`
        ) || '';
    }
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(instance),
      instance.passhash
    ).toString();
    let localUserData: UserData = {
      name: instance.name,
      did: instance.did,
      data: encrypted
    };
    let json = JSON.stringify(localUserData, null, '');
    window.localStorage.setItem(key, json);
  }

  private static unlockUser(
    key: string,
    storePassword: string
  ): ISessionItem | undefined {
    let item = window.localStorage.getItem(key);
    if (!item) {
      alertError(null, 'User could not be found');
      return;
    }

    try {
      let did = `did:elastos:${key.replace('user_', '')}`;
      var passhash = CryptoJS.SHA256(did + storePassword).toString(
        CryptoJS.enc.Hex
      );
      let userData: UserData = JSON.parse(item);

      let decrypted = CryptoJS.AES.decrypt(userData.data, passhash);

      let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

      if (instance && instance.did && instance.name) {
        return instance;
      }
    } catch (error) {}
    alertError(null, 'Incorrect Password');
    return;
  }

  public static getSignedUsers(): string[] {
    let response: string[] = [];
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i);
      if (key && key.startsWith('user_')) {
        response.push(key.replace('user_', 'did:elastos:'));
      }
    }
    return response;
  }

  public static async LockWithDIDAndPwd(
    sessionItem: ISessionItem,
    password: string = ''
  ) {
    let newSessionItem = sessionItem;
    if (
      !newSessionItem.passhash ||
      newSessionItem.passhash.trim().length === 0
    ) {
      newSessionItem.passhash = CryptoJS.SHA256(
        newSessionItem.did + password
      ).toString(CryptoJS.enc.Hex);
    }

    const res = await this.SearchUserWithDID(sessionItem.did);
    if (res) {
      newSessionItem.onBoardingCompleted = res.onBoardingCompleted;
      newSessionItem.tutorialStep = res.tutorialStep;
    }

    this.lockUser(this.key(newSessionItem.did), newSessionItem);
    // SessionService.saveSessionItem(newSessionItem);
    window.localStorage.setItem(
      'session_instance',
      JSON.stringify(newSessionItem, null, '')
    );
    await UserVaultScriptService.register();
  }

  public static async SearchUserWithDID(did: string) {
    let response: any = await TuumTechScriptService.searchUserWithDID(did);
    const { data, meta } = response;
    if (meta.code === 200 && meta.message === 'OK') {
      const { get_user_by_did } = data;
      if (
        get_user_by_did &&
        get_user_by_did.items &&
        get_user_by_did.items.length > 0
      ) {
        const userData = get_user_by_did.items[0];
        const isDIDPublished = await DidService.isDIDPublished(userData.did);

        return {
          ...userData,
          isDIDPublished: isDIDPublished ? isDIDPublished : false,
          onBoardingCompleted: userData ? userData.onBoardingCompleted : false,
          tutorialStep: userData ? userData.tutorialStep : 1
        };
      } else {
        return;
      }
    } else {
      alertError(null, 'Error while searching the user by DID');
      return;
    }
  }

  public static async CreateNewUser(
    name: string,
    accountType: AccountType,
    loginCred: LoginCred,
    credential: string = '',
    storePassword: string,
    newDidStr: string,
    newMnemonicStr: string,
    hiveHostStr: string
  ) {
    let did = newDidStr;
    let mnemonics = newMnemonicStr;

    if (!did || did === '') {
      const newDid = await this.generateTemporaryDID(
        accountType,
        credential,
        name
      );
      did = newDid.did;
      mnemonics = newDid.mnemonic;
    }
    const passhash = CryptoJS.SHA256(did + storePassword).toString(
      CryptoJS.enc.Hex
    );

    const isDIDPublished = await DidService.isDIDPublished(did);
    let sessionItem: ISessionItem = {
      did,
      accountType,
      passhash,
      name,
      userToken: credential,
      isDIDPublished: isDIDPublished ? isDIDPublished : false,
      onBoardingCompleted: false,
      loginCred: loginCred || {},
      badges: {
        account: {
          beginnerTutorial: {
            archived: false
          },
          basicProfile: {
            archived: false
          },
          educationProfile: {
            archived: false
          },
          experienceProfile: {
            archived: false
          }
        },
        socialVerify: {
          linkedin: {
            archived: false
          },
          facebook: {
            archived: false
          },
          twitter: {
            archived: false
          },
          google: {
            archived: false
          },
          email: {
            archived: false
          },
          phone: {
            archived: false
          }
        },
        didPublishTimes: {
          _1times: {
            archived: false
          },
          _5times: {
            archived: false
          },
          _10times: {
            archived: false
          },
          _25times: {
            archived: false
          },
          _50times: {
            archived: false
          },
          _100times: {
            archived: false
          }
        },
        dStorage: {
          ownVault: {
            archived: false
          }
        }
      },
      tutorialStep: 1,
      hiveHost:
        hiveHostStr === ''
          ? `${process.env.REACT_APP_TUUM_TECH_HIVE}`
          : hiveHostStr,
      avatar: '',
      code: Guid.create().toString(),
      status: 'Created',
      mnemonics
    };
    let curTime = new Date().getTime();
    if (loginCred) {
      if (loginCred.email)
        sessionItem.badges!.socialVerify!.email.archived = curTime;
      if (loginCred.facebook)
        sessionItem.badges!.socialVerify!.facebook.archived = curTime;
      if (loginCred.twitter)
        sessionItem.badges!.socialVerify!.twitter.archived = curTime;
      if (loginCred.linkedin)
        sessionItem.badges!.socialVerify!.linkedin.archived = curTime;
      if (loginCred.google)
        sessionItem.badges!.socialVerify!.google.archived = curTime;
    }
    if (accountType === AccountType.Email) {
      // the confirmation code for email verification is passed as credential in the email flow, we can improve that
      sessionItem.status = 'CONFIRMED';
      sessionItem.code = credential;

      sessionItem.badges!.socialVerify!.email.archived = curTime;
      await TuumTechScriptService.updateEmailUserDidInfo(sessionItem);
    } else {
      sessionItem.status = 'CONFIRMED';
      if (accountType === AccountType.Twitter) {
        sessionItem.badges!.socialVerify!.twitter.archived = curTime;
      }
      if (accountType === AccountType.Linkedin) {
        sessionItem.badges!.socialVerify!.linkedin.archived = curTime;
      }
      if (accountType === AccountType.Google) {
        sessionItem.badges!.socialVerify!.google.archived = curTime;
      }
      if (accountType === AccountType.Facebook) {
        sessionItem.badges!.socialVerify!.facebook.archived = curTime;
      }
      await TuumTechScriptService.addUserToTuumTech(sessionItem);
    }

    this.lockUser(this.key(did), sessionItem);
    // SessionService.saveSessionItem(sessionItem);
    window.localStorage.setItem(
      'session_instance',
      JSON.stringify(sessionItem, null, '')
    );
  }

  public static async updateSession(
    sessionItem: ISessionItem,
    notifyUser: boolean = false
  ): Promise<void> {
    let newSessionItem = sessionItem;
    const userData = await TuumTechScriptService.searchUserWithDID(
      sessionItem.did
    );
    if (
      userData &&
      userData.data &&
      userData.data['get_user_by_did'] &&
      userData.data['get_user_by_did']['items'] &&
      userData.data['get_user_by_did']['items'].length > 0 &&
      userData.data['get_user_by_did']['items'][0].code
    ) {
      const code = userData.data['get_user_by_did']['items'][0].code;
      newSessionItem.code = code;
    }

    const res: any = await TuumTechScriptService.updateUserDidInfo(
      newSessionItem
    );
    this.lockUser(this.key(sessionItem.did), newSessionItem);

    window.localStorage.setItem(
      'session_instance',
      JSON.stringify(newSessionItem, null, '')
    );

    if (notifyUser && res.meta.code === 200 && res.data._status === 'OK') {
      showNotify('User info is successfuly saved', 'success');
    }
  }

  public static async UnLockWithDIDAndPwd(did: string, storePassword: string) {
    let instance = this.unlockUser(this.key(did), storePassword);
    const res = await this.SearchUserWithDID(did);
    if (!res) {
      alertError(null, 'Could not find user with this DID');
    } else if (instance) {
      instance.onBoardingCompleted = res.onBoardingCompleted;
      instance.tutorialStep = res.tutorialStep;
      this.lockUser(this.key(instance.did), instance);

      // SessionService.saveSessionItem(instance);
      window.localStorage.setItem(
        'session_instance',
        JSON.stringify(instance, null, '')
      );

      await UserVaultScriptService.register();
      return instance;
    }
    return null;
  }

  public static async logout() {
    // SessionService.Logout();
    window.sessionStorage.clear();
    window.localStorage.removeItem('session_instance');
    window.location.href = '/create-profile';
  }

  public static GetUserSession(): ISessionItem | undefined {
    // let item = window.sessionStorage.getItem('session_instance');
    // if (item) {
    //   return JSON.parse(item);
    // }
    let item = window.localStorage.getItem('session_instance');
    if (item) {
      return JSON.parse(item);
    }
    return;
  }

  // public static async DuplicateNewSession(did: string) {
  //   const newSession = (await this.SearchUserWithDID(did)) as ISessionItem;
  //   if (newSession && newSession && newSession.did) {
  //     SessionService.saveSessionItem(newSession);
  //     await UserVaultScriptService.register();
  //   }
  // }
}

//To be
// class SessionService {
//   static getSession(): ISessionItem | undefined {
//     let item = window.sessionStorage.getItem('session_instance');

//     if (!item) {
//       // alertError(null, 'Not logged in');
//       return;
//     }

//     let instance = JSON.parse(item);
//     return instance;
//   }

//   static saveSessionItem(item: ISessionItem) {
//     window.sessionStorage.setItem(
//       'session_instance',
//       JSON.stringify(item, null, '')
//     );
//   }

//   static Logout() {
//     window.sessionStorage.clear();
//     window.location.href = '/create-profile';
//   }
// }
