import { alertError } from 'src/utils/notify';

import { AssistService } from './assist.service';
import { DidService, IDID, PublishRequestOperation } from './did.service';
import { DidDocumentService } from './diddocument.service';
import {
  TuumTechScriptService,
  UserVaultScriptService
} from './script.service';

const CryptoJS = require('crypto-js');

export enum AccountType {
  DID = 'DID',
  Linkedin = 'Linkedin',
  Facebook = 'Facebook',
  Google = 'Google',
  Twitter = 'Twitter',
  Email = 'Email'
}

export interface ISessionItem {
  hiveHost: string;
  userToken: string;
  accountType: AccountType;
  did: string;
  name: string;
  email?: string;
  isDIDPublished: boolean;
  mnemonics: string;
  onBoardingCompleted: boolean;
  tutorialCompleted: boolean;
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
    credential: string
  ): Promise<IDID> {
    let newDID = await DidService.generateNew();
    let temporaryDocument = await DidService.genereteNewDidDocument(newDID);
    DidService.sealDIDDocument(newDID, temporaryDocument);
    DidDocumentService.updateUserDocument(temporaryDocument);

    let requestPub = await DidService.generatePublishRequest(
      temporaryDocument,
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

  private static lockUser(
    key: string,
    instance: ISessionItem,
    storePassword: string
  ) {
    let encrypted = CryptoJS.AES.encrypt(
      JSON.stringify(instance),
      storePassword
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
      alertError(null, 'User not found');
      return;
    }
    let userData: UserData = JSON.parse(item);
    let decrypted = CryptoJS.AES.decrypt(userData.data, storePassword);
    let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));

    if (instance && instance.userToken) {
      return instance;
    }
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
    storePassword: string
  ) {
    this.lockUser(this.key(sessionItem.did), sessionItem, storePassword);
    SessionService.saveSessionItem(sessionItem);
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
          accountType: userData.accountType,
          did: userData.did,
          name: userData.name,
          hiveHost: userData.hiveHost,
          email: userData.email,
          userToken: userData.userToken,
          isDIDPublished: isDIDPublished ? isDIDPublished : false,
          onBoardingCompleted: userData.onBoardingCompleted,
          tutorialCompleted: userData.tutorialCompleted
        };
      } else {
        return null;
      }
    } else {
      alertError(null, 'Error while searching user by did');
      return;
    }
  }

  public static async CreateNewUser(
    name: string,
    token: string,
    service: AccountType,
    email: string,
    credential: string,
    storePassword: string,
    newDidStr: string,
    newMnemonicStr: string,
    hiveHostStr: string
  ) {
    let sessionItem: ISessionItem;

    let did = newDidStr;
    let mnemonic = newMnemonicStr;

    if (!did || did === '') {
      const newDid = await this.generateTemporaryDID(service, credential);
      did = newDid.did;
      mnemonic = newDid.mnemonic;
    }

    sessionItem = {
      did: did,
      accountType: service,
      isDIDPublished: await DidService.isDIDPublished(did),
      name,
      hiveHost:
        hiveHostStr === ''
          ? `${process.env.REACT_APP_TUUM_TECH_HIVE}`
          : hiveHostStr,
      userToken: token,
      mnemonics: mnemonic,
      email: email,
      onBoardingCompleted: false,
      tutorialCompleted: false
    };

    // add new user to the tuum.tech vault
    if (service === AccountType.Email) {
      await TuumTechScriptService.updateUserDidInfo({
        email: email,
        code: credential,
        did: did,
        hiveHost: sessionItem.hiveHost,
        accountType: service,
        userToken: token,
        tutorialCompleted: false
      });
    } else {
      await TuumTechScriptService.addUserToTuumTech({
        name,
        email: email,
        status: 'CONFIRMED',
        code: '1',
        did: did,
        hiveHost: sessionItem.hiveHost,
        accountType: service,
        userToken: token,
        tutorialCompleted: false
      });
    }

    this.lockUser(this.key(did), sessionItem, storePassword);
    SessionService.saveSessionItem(sessionItem);
  }

  public static async setOnBoardingCompleted() {
    let sessionItem = this.GetUserSession();
    if (sessionItem && !sessionItem.onBoardingCompleted) {
      sessionItem.onBoardingCompleted = true;
      window.sessionStorage.setItem(
        'session_instance',
        JSON.stringify(sessionItem, null, '')
      );
      await TuumTechScriptService.updateUser({
        did: sessionItem.did,
        name: sessionItem.name,
        email: sessionItem.email!,
        onBoardingCompleted: true
      });
    }
  }

  public static updateSession(sessionItem: ISessionItem) {
    window.sessionStorage.setItem(
      'session_instance',
      JSON.stringify(sessionItem, null, '')
    );
  }

  public static async UnLockWithDIDAndPwd(did: string, storePassword: string) {
    try {
      let instance = this.unlockUser(this.key(did), storePassword);
      const res = await this.SearchUserWithDID(did);

      if (res && instance) {
        instance.onBoardingCompleted = res.onBoardingCompleted;
        instance.tutorialCompleted = res.tutorialCompleted;
        this.lockUser(this.key(instance.did), instance, storePassword);
        SessionService.saveSessionItem(instance);
        await UserVaultScriptService.register();
        return instance;
      } else {
        alertError(null, 'User Not found secured by this password');
      }
    } catch (error) {
      // return null;
      alertError(null, 'User Not found secured by this password');
    }
    return null;
  }

  public static async logout() {
    SessionService.Logout();
  }

  public static GetUserSession(): ISessionItem | undefined {
    let item = window.sessionStorage.getItem('session_instance');

    if (!item) {
      alertError(null, 'Not logged in');
      return;
    } else {
      return JSON.parse(item);
    }
  }
}

//To be
class SessionService {
  static getSession(): ISessionItem | undefined {
    let item = window.sessionStorage.getItem('session_instance');

    if (!item) {
      alertError(null, 'Not logged in');
      return;
    }

    let instance = JSON.parse(item);
    return instance;
  }

  static saveSessionItem(item: ISessionItem) {
    window.sessionStorage.setItem(
      'session_instance',
      JSON.stringify(item, null, '')
    );
  }

  static Logout() {
    window.sessionStorage.clear();
    window.location.href = '/create-profile';
  }
}
