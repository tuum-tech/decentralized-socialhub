import { Guid } from 'guid-typescript';

import { alertError, showNotify } from 'src/utils/notify';

import { AssistService } from './assist.service';
import { DidService, IDID, PublishRequestOperation } from './did.service';
import { DidDocumentService } from './diddocument.service';
import {
  TuumTechScriptService,
  UserVaultScriptService
} from './script.service';
import { ProfileService } from './profile.service';

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

      const decodedMnemonic = JSON.parse(instance.mnemonics);
      if (decodedMnemonic.mnemonic) {
        instance.mnemonics = decodedMnemonic.mnemonic;
      }
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

    if (newSessionItem && newSessionItem.did !== '') {
      return await UserVaultScriptService.register(newSessionItem);
    }
    return newSessionItem;
  }

  public static async SearchUserWithDID(did: string) {
    const users = await TuumTechScriptService.searchUserWithDIDs([did]);
    if (users.length > 0) {
      const userData = users[0];
      const isDIDPublished = await DidService.isDIDPublished(userData.did);
      return {
        ...userData,
        isDIDPublished: isDIDPublished ? isDIDPublished : false,
        onBoardingCompleted: userData ? userData.onBoardingCompleted : false,
        tutorialStep: userData ? userData.tutorialStep : 1
      };
    }
    return;
  }

  public static async CreateNewUser(
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
      hiveHost:
        hiveHostStr === ''
          ? `${process.env.REACT_APP_TUUM_TECH_HIVE}`
          : hiveHostStr,
      avatar,
      code: Guid.create().toString(),
      status: 'Created',
      mnemonics,
      coverPhoto: ''
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
    this.lockUser(this.key(did), sessionItem);

    window.localStorage.setItem('isLoggedIn', 'true');

    return sessionItem;
  }

  public static async updateSession(
    sessionItem: ISessionItem,
    notifyUser: boolean = false
  ): Promise<ISessionItem> {
    let newSessionItem = sessionItem;
    const userData = await UserService.SearchUserWithDID(sessionItem.did);
    if (userData && userData.code) {
      newSessionItem.code = userData.code;
      if (userData.userToken) {
        newSessionItem.userToken = userData.userToken;
      }
    }
    const res: any = await TuumTechScriptService.updateTuumUser(newSessionItem);
    this.lockUser(this.key(sessionItem.did), newSessionItem);

    if (notifyUser && res.meta.code === 200 && res.data._status === 'OK') {
      showNotify('User info is successfuly saved', 'success');
    }
    return newSessionItem;
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

      window.localStorage.setItem('isLoggedIn', 'true');
      return await UserVaultScriptService.register(instance);
    }
    return null;
  }

  public static async logout() {
    // SessionService.Logout();
    window.sessionStorage.clear();
    window.localStorage.removeItem('isLoggedIn');
    window.location.href = '/create-profile';
  }
}
