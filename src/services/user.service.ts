import { Guid } from 'guid-typescript';

import { alertError, showNotify } from 'src/utils/notify';

import { HiveService } from './hive.service';
import { AssistService } from './assist.service';

import { UserVaultScripts } from '../scripts/uservault.script';
import {
  TuumTechScriptService,
  UserVaultScriptService
} from './script.service';
import { ProfileService } from './profile.service';
import {
  DID,
  DIDDocument,
  RootIdentity,
  VerifiableCredential,
  VerifiablePresentation
} from '@elastosfoundation/did-js-sdk/';
import { IDidService } from './did.service.new';

const CryptoJS = require('crypto-js');

export enum AccountType {
  DID = 'DID',
  Linkedin = 'Linkedin',
  Facebook = 'Facebook',
  Google = 'Google',
  Github = 'Github',
  Discord = 'Discord',
  Twitter = 'Twitter',
  Email = 'Email'
}

export enum FollowType {
  Follower = 'Follower',
  Following = 'Following',
  MutualFollower = 'MutualFollower'
}

export class UserService {
  constructor(private didService: IDidService) {}

  private static key(did: string): string {
    return `user_${did.replace('did:elastos:', '')}`;
  }

  private async generateTemporaryDocument(
    service: AccountType,
    credential: string,
    mnemonics: string,
    name: string
  ): Promise<DIDDocument> {
    let rootIdentity: RootIdentity = this.didService.storeNewRootIdentity(
      mnemonics
    );
    let temporaryDocument: DIDDocument = await this.didService.storeNewDIDDocument(
      rootIdentity
    );

    let nameCredential: VerifiableCredential = await this.didService.newSelfVerifiableCredential(
      temporaryDocument,
      'name',
      name
    );

    let documentWithNameCred = await this.didService.addVerifiableCredentialToDIDDocument(
      temporaryDocument,
      nameCredential
    );

    this.didService.storeDocument(documentWithNameCred);

    this.didService.publishDocument(documentWithNameCred);

    window.localStorage.setItem(
      `temporary_${documentWithNameCred
        .getSubject()
        .toString()
        .replace('did:elastos:', '')}`,
      JSON.stringify({
        mnemonic: mnemonics
      })
    );

    return documentWithNameCred;
  }

  public getTemporaryMnemonicFromDid(did: string) {
    if (!did || did === '') return '';
    let key = `temporary_${did.replace('did:elastos:', '')}`;
    let response: any = window.localStorage.getItem(key);
    if (response) return response.mnemonic;
  }

  private lockUser(key: string, instance: ISessionItem) {
    if (!instance.mnemonics || instance.mnemonics === '') {
      instance.mnemonics =
        window.localStorage.getItem(
          `temporary_${instance.did.replace('did:elastos:', '')}`
        ) || '';

      const decodedMnemonic = JSON.parse(instance.mnemonics);
      instance.mnemonics = decodedMnemonic.mnemonic || '';
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

  private unlockUser(
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

  public static async getSignedUsers() {
    let response: string[] = [];
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i);
      if (key && key.startsWith('user_')) {
        response.push(key.replace('user_', 'did:elastos:'));
      }
    }
    return response;
  }

  public static async removeLocalUser(did: string) {
    const didStr = did.replace('did:elastos:', '');
    const removeKeys = [];
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i);
      if (key && key.includes(didStr)) {
        removeKeys.push(key);
      }
    }
    for (let i = 0; i < removeKeys.length; i++) {
      window.localStorage.removeItem(removeKeys[i]);
    }
  }

  public async LockWithDIDAndPwd(
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

    this.lockUser(UserService.key(newSessionItem.did), newSessionItem);

    if (newSessionItem && newSessionItem.did !== '') {
      return await UserVaultScriptService.register(newSessionItem);
    }
    return newSessionItem;
  }

  public async SearchUserWithDID(did: string) {
    const users = await TuumTechScriptService.searchUserWithDIDs([did]);
    if (users.length > 0) {
      const userData = users[0];
      let isDIDPublished = false;
      try {
        isDIDPublished = await this.didService.isDIDPublished(userData.did);
      } catch (e) {
        isDIDPublished = false;
      }

      return {
        ...userData,
        isDIDPublished: isDIDPublished ? isDIDPublished : false,
        onBoardingCompleted: userData ? userData.onBoardingCompleted : false,
        tutorialStep: userData ? userData.tutorialStep : 1
      };
    }
    return;
  }

  public async CreateNewUser(
    name: string,
    accountType: AccountType,
    loginCred: LoginCred,
    credential: string = '',
    storePassword: string,
    newDidStr: string,
    newMnemonicStr: string,
    hiveHostStr: string,
    avatar = ''
  ) {
    let did = newDidStr;
    let mnemonics = newMnemonicStr;
    if (!did || did === '') {
      mnemonics = await this.didService.generateNewMnemonics();
      const newDocument = await this.generateTemporaryDocument(
        accountType,
        credential,
        mnemonics,
        name
      );
      did = newDocument.getSubject().toString();
    }
    const passhash = CryptoJS.SHA256(did + storePassword).toString(
      CryptoJS.enc.Hex
    );
    const isDIDPublished = await this.didService.isDIDPublished(did);
    let sessionItem: ISessionItem = {
      did,
      accountType,
      passhash,
      name,
      userToken: '',
      isDIDPublished: isDIDPublished ? isDIDPublished : false,
      didPublishTime: 0,
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
          github: {
            archived: false
          },
          discord: {
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
      hiveHost: !hiveHostStr
        ? `${process.env.REACT_APP_TUUM_TECH_HIVE}`
        : hiveHostStr,
      avatar,
      code: Guid.create().toString(),
      status: 'Created',
      mnemonics,
      coverPhoto: '',
      pageTemplate: 'default',
      timestamp: Date.now()
    };
    let curTime = new Date().getTime();
    let messages = [];
    if (loginCred) {
      if (loginCred.email) {
        sessionItem.badges!.socialVerify!.email.archived = curTime;
        messages.push('You received a Email verfication badge');
      }
      if (loginCred.facebook) {
        sessionItem.badges!.socialVerify!.facebook.archived = curTime;
        messages.push('You received a Facebook verfication badge');
      }
      if (loginCred.twitter) {
        sessionItem.badges!.socialVerify!.twitter.archived = curTime;
        messages.push('You received a Twitter verfication badge');
      }
      if (loginCred.linkedin) {
        sessionItem.badges!.socialVerify!.linkedin.archived = curTime;
        messages.push('You received a Linkedin verfication badge');
      }
      if (loginCred.google) {
        sessionItem.badges!.socialVerify!.google.archived = curTime;
        messages.push('You received a Google verfication badge');
      }
      if (loginCred.github) {
        sessionItem.badges!.socialVerify!.github.archived = curTime;
        messages.push('You received a Github verfication badge');
      }
      if (loginCred.discord) {
        sessionItem.badges!.socialVerify!.discord.archived = curTime;
        messages.push('You received a Discord verfication badge');
      }
    }
    if (accountType === AccountType.Email) {
      // the confirmation code for email verification is passed as credential in the email flow, we can improve that
      sessionItem.status = 'CONFIRMED';
      sessionItem.code = credential;

      sessionItem.badges!.socialVerify!.email.archived = curTime;
      messages.push('You received a Email verfication badge');
      await TuumTechScriptService.updateTuumEmailUser(sessionItem);
    } else {
      sessionItem.status = 'CONFIRMED';
      if (accountType === AccountType.Twitter) {
        sessionItem.badges!.socialVerify!.twitter.archived = curTime;
        messages.push('You received a Twitter verfication badge');
      }
      if (accountType === AccountType.Linkedin) {
        sessionItem.badges!.socialVerify!.linkedin.archived = curTime;
        messages.push('You received a Linkedin verfication badge');
      }
      if (accountType === AccountType.Google) {
        sessionItem.badges!.socialVerify!.google.archived = curTime;
        messages.push('You received a Google verfication badge');
      }
      if (accountType === AccountType.Facebook) {
        sessionItem.badges!.socialVerify!.facebook.archived = curTime;
        messages.push('You received a Facebook verfication badge');
      }
      if (accountType === AccountType.Github) {
        sessionItem.badges!.socialVerify!.github.archived = curTime;
        messages.push('You received a Github verfication badge');
      }
      if (accountType === AccountType.Discord) {
        sessionItem.badges!.socialVerify!.discord.archived = curTime;
        messages.push('You received a Discord verfication badge');
      }
      await TuumTechScriptService.addUserToTuumTech(sessionItem);
      await ProfileService.addActivity(
        {
          guid: '',
          did: sessionItem!.did,
          message: 'Welcome to Profile 👏, Your service to the private web 🔐️',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },

        sessionItem
      );
    }

    Array.from(new Set(messages)).forEach(async message => {
      await ProfileService.addActivity(
        {
          guid: '',
          did: sessionItem.did,
          message: message,
          read: false,
          createdAt: 0,
          updatedAt: 0
        },

        sessionItem
      );
    });
    this.lockUser(UserService.key(did), sessionItem);

    window.localStorage.setItem('isLoggedIn', 'true');

    return sessionItem;
  }

  public async updateSession(
    sessionItem: ISessionItem,
    notifyUser: boolean = false
  ) {
    let newSessionItem = sessionItem;
    const userData = await this.SearchUserWithDID(sessionItem.did);
    if (userData && userData.code) {
      newSessionItem.code = userData.code;

      // workaround the fact that session is not updated inside tutorial
      if (userData.userToken) {
        newSessionItem.userToken = userData.userToken;
      }
    }
    const res: any = await TuumTechScriptService.updateTuumUser(newSessionItem);
    this.lockUser(UserService.key(sessionItem.did), newSessionItem);

    if (notifyUser && res.meta.code === 200 && res.data._status === 'OK') {
      showNotify('User info is successfuly saved', 'success');
    }
    return newSessionItem;
  }

  public async UnLockWithDIDAndPwd(did: string, storePassword: string) {
    let instance = this.unlockUser(UserService.key(did), storePassword);
    if (!instance) return null;
    const res = await this.SearchUserWithDID(did);

    if (!res) {
      alertError(null, 'Could not find user with this DID');
    } else if (instance) {
      instance.onBoardingCompleted = res.onBoardingCompleted;
      instance.tutorialStep = res.tutorialStep;
      this.lockUser(UserService.key(instance.did), instance);

      window.localStorage.setItem('isLoggedIn', 'true');
      return await UserVaultScriptService.register(instance);
    }
    return null;
  }

  public static logout() {
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('persist:root');
    window.location.href = '/';
  }

  public static async deleteUser(useSession: ISessionItem) {
    let hiveInstance = await HiveService.getSessionInstance(useSession);
    await UserVaultScripts.Delete(hiveInstance!);
    window.localStorage.removeItem(
      `user_${useSession.did.replace('did:elastos:', '')}`
    );
    window.localStorage.removeItem(
      `temporary_${useSession.did.replace('did:elastos:', '')}`
    );
    window.localStorage.removeItem(
      `userdiddocument_${useSession.did.replace('did:elastos:', '')}`
    );
    UserService.logout();
  }
}
