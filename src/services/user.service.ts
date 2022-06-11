import { Guid } from 'guid-typescript';

import { alertError, showNotify } from 'src/utils/notify';

import { HiveService } from './hive.service';

import { UserVaultScripts } from '../scripts/uservault.script';
import {
  TuumTechScriptService,
  UserVaultScriptService
} from './script.service';
import { ProfileService } from './profile.service';
import {
  DID,
  DIDDocument,
  DIDURL,
  RootIdentity
} from '@elastosfoundation/did-js-sdk/';
import { DidService, IDidService } from './did.service.new';
import { CredentialType, DidcredsService } from './didcreds.service';
import { SpaceService } from './space.service';
import { EssentialsConnector } from '@elastosfoundation/essentials-connector-client-browser';
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { DidDocumentService } from './diddocument.service';

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

  hasOwnProperty<X extends {}, Y extends PropertyKey>(
    obj: X,
    prop: Y
  ): obj is X & Record<Y, unknown> {
    return obj.hasOwnProperty(prop);
  }

  containsInternetAccountCredential = (
    document: DIDDocument,
    id: string
  ): boolean => {
    return document.selectCredentials(id, 'BasicProfileCredential').length > 0;
  };

  addCredentialIfInexistant = async (
    credentialValue: any | undefined,
    document: DIDDocument,
    credentialType: CredentialType
  ): Promise<DIDDocument> => {
    if (credentialValue === undefined) return document;

    if (
      !this.containsInternetAccountCredential(
        document,
        credentialType as string
      )
    ) {
      let verifiableCredential = await DidcredsService.generateVerifiableCredential(
        document.getSubject().toString(),
        credentialType,
        credentialValue as string
      );

      let documentWithCredentials = await this.didService.addVerifiableCredentialToDIDDocument(
        document,
        verifiableCredential
      );

      return documentWithCredentials;
    }
    return document;
  };

  updateCredential = async (
    document: DIDDocument,
    credentialType: CredentialType,
    credentialValue: string
  ): Promise<DIDDocument> => {
    let verifiableCredential = await DidcredsService.generateVerifiableCredential(
      document.getSubject().toString(),
      credentialType,
      credentialValue as string
    );

    let builder = DIDDocument.Builder.newFromDocument(document);
    if (
      this.containsInternetAccountCredential(
        document,
        credentialType.toLowerCase() as string
      )
    ) {
      builder = builder.removeCredential(credentialType.toLowerCase());
    }

    return (await builder.addCredential(verifiableCredential)).seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );
  };

  private async generateTemporaryDocument(
    service: AccountType,
    credential: string,
    mnemonics: string,
    name: string,
    loginCred: LoginCred
  ): Promise<DIDDocument> {
    let rootIdentity: RootIdentity = this.didService.storeNewRootIdentity(
      mnemonics
    );
    let temporaryDocument: DIDDocument = await this.didService.storeNewDIDDocument(
      rootIdentity
    );

    let documentWithCredentials: DIDDocument = await this.addCredentialIfInexistant(
      loginCred.email,
      temporaryDocument,
      CredentialType.Email
    );
    documentWithCredentials = await this.addCredentialIfInexistant(
      loginCred.google,
      documentWithCredentials,
      CredentialType.Google
    );
    documentWithCredentials = await this.addCredentialIfInexistant(
      loginCred.facebook,
      documentWithCredentials,
      CredentialType.Facebook
    );
    documentWithCredentials = await this.addCredentialIfInexistant(
      loginCred.linkedin,
      documentWithCredentials,
      CredentialType.Linkedin
    );
    documentWithCredentials = await this.addCredentialIfInexistant(
      loginCred.discord,
      documentWithCredentials,
      CredentialType.Discord
    );
    documentWithCredentials = await this.addCredentialIfInexistant(
      loginCred.github,
      documentWithCredentials,
      CredentialType.Github
    );
    documentWithCredentials = await this.addCredentialIfInexistant(
      loginCred.twitter,
      documentWithCredentials,
      CredentialType.Twitter
    );

    // Add hive to the documents
    let endpoint = `${process.env.REACT_APP_TUUM_TECH_HIVE}`;
    temporaryDocument = await this.didService.addServiceToDIDDocument(
      temporaryDocument,
      endpoint
    );
    documentWithCredentials = await this.didService.addServiceToDIDDocument(
      documentWithCredentials,
      endpoint
    );

    // Add name to the documents
    let nameCredential = await this.didService.newSelfVerifiableCredential(
      temporaryDocument,
      'name',
      name
    );
    documentWithCredentials = await this.didService.addVerifiableCredentialToDIDDocument(
      documentWithCredentials,
      nameCredential
    );
    temporaryDocument = await this.didService.addVerifiableCredentialToDIDDocument(
      temporaryDocument,
      nameCredential
    );

    this.didService.storeDocument(documentWithCredentials);
    this.didService.publishDocument(temporaryDocument);

    window.localStorage.setItem(
      `temporary_${documentWithCredentials
        .getSubject()
        .toString()
        .replace('did:elastos:', '')}`,
      JSON.stringify({
        mnemonic: mnemonics
      })
    );

    return documentWithCredentials;
  }

  public getTemporaryMnemonicFromDid(did: string) {
    if (!did || did === '') return '';
    let key = `temporary_${did.replace('did:elastos:', '')}`;
    let response: any = JSON.parse(window.localStorage.getItem(key) || 'null');
    return response?.mnemonic || '';
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
    storePassword: string,
    showAlert = true
  ): ISessionItem | undefined {
    let item = window.localStorage.getItem(key);
    if (!item) {
      if (showAlert) alertError(null, 'User could not be found');
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

    if (showAlert) alertError(null, 'Incorrect Password');

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

  public async SearchUserWithDID(did: string) {
    const users = await TuumTechScriptService.searchUserWithDIDs([did]);
    if (users.length > 0) {
      const userData = users[0];
      const blockchainDocument = await DidDocumentService.loadFromBlockchain(
        did
      );
      if (blockchainDocument) {
        let serviceEndpoint = '';
        let hiveUrl = new DIDURL(did + '#hivevault');
        if (blockchainDocument.services?.has(hiveUrl)) {
          serviceEndpoint = blockchainDocument.services.get(hiveUrl)
            .serviceEndpoint;
        } else {
          hiveUrl = new DIDURL(did + '#HiveVault');
          if (blockchainDocument.services?.has(hiveUrl)) {
            serviceEndpoint = blockchainDocument.services.get(hiveUrl)
              .serviceEndpoint;
          }
        }
        if (serviceEndpoint) {
          userData.hiveHost = serviceEndpoint;
        }
      }
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

  public async RemovePassword(session: ISessionItem) {
    let newSessionItem = session;

    newSessionItem.passwordRemoved = true;
    newSessionItem.passhash = CryptoJS.SHA256(newSessionItem.did + '').toString(
      CryptoJS.enc.Hex
    );

    await TuumTechScriptService.updateTuumUser(newSessionItem);

    // remove local storage data
    window.localStorage.removeItem(
      `user_${session.did.replace('did:elastos:', '')}`
    );

    this.lockUser(UserService.key(newSessionItem.did), newSessionItem);

    return newSessionItem;
  }

  public async CreateNewUser(
    name: string,
    accountType: AccountType,
    loginCred: LoginCred,
    credential: string = '',
    // storePassword: string,
    newDidStr: string,
    newMnemonicStr: string,
    hiveHostStr: string,
    avatar = ''
  ) {
    let did = newDidStr;
    let mnemonics = newMnemonicStr;
    let serviceEndpoint = hiveHostStr;
    if (!did || did === '') {
      mnemonics = await this.didService.generateNewMnemonics();
      const newDocument = await this.generateTemporaryDocument(
        accountType,
        credential,
        mnemonics,
        name,
        loginCred
      );
      did = newDocument.getSubject().toString();

      let hiveUrl = new DIDURL(did + '#hivevault');
      if (newDocument.services?.has(hiveUrl)) {
        serviceEndpoint = newDocument.services.get(hiveUrl).serviceEndpoint;
      }
    }

    const passhash = CryptoJS.SHA256(did).toString(CryptoJS.enc.Hex);
    const isDIDPublished = await this.didService.isDIDPublished(did);
    let sessionItem: ISessionItem = {
      did,
      accountType,
      passhash,
      name,
      userToken: '',
      isEssentialUser: !mnemonics,
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
      hiveHost: !serviceEndpoint
        ? `${process.env.REACT_APP_TUUM_TECH_HIVE}`
        : serviceEndpoint,
      avatar,
      code: Guid.create().toString(),
      status: 'Created',
      mnemonics,
      coverPhoto: '',
      pageTemplate: 'default',
      timestamp: Date.now(),
      referrals: [] as IReferral[],
      wallets: {}
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

      let didAlreadyAdded = await TuumTechScriptService.searchUserWithDIDs([
        did
      ]);

      if (didAlreadyAdded.length === 0) {
        await TuumTechScriptService.addUserToTuumTech(sessionItem);
      } else {
        await TuumTechScriptService.updateTuumUser(sessionItem);
      }

      await ProfileService.addActivity(
        {
          guid: '',
          did: sessionItem!.did,
          message: 'Welcome to Profile �, Your service to the private web �️',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },

        sessionItem
      );
    }

    const referral = window.localStorage.getItem('referral') || '';
    if (referral !== '') {
      await TuumTechScriptService.addReferral(referral, sessionItem.did);
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

    const wtp = await SpaceService.getCommunitySpaceByNames([
      'welcome-to-profile'
    ]);
    if (wtp.length > 0) {
      await SpaceService.follow(sessionItem, wtp[0]);
    }

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

      if (userData.hiveHost) {
        newSessionItem.hiveHost = userData.hiveHost;
      }
    }
    const res: any = await TuumTechScriptService.updateTuumUser(newSessionItem);
    this.lockUser(UserService.key(sessionItem.did), newSessionItem);

    if (notifyUser && res.meta.code === 200 && res.data._status === 'OK') {
      showNotify('User info is successfuly saved', 'success');
    }
    return newSessionItem;
  }

  private async isHiveVersionValid(
    sessionItem: ISessionItem
  ): Promise<boolean> {
    if (sessionItem.hiveHost === undefined || sessionItem.hiveHost.length <= 0)
      return false;

    let hiveVersion = await HiveService.getHiveVersion(sessionItem.hiveHost);
    let isHiveValid = await HiveService.isHiveVersionSupported(hiveVersion);
    if (!isHiveValid) {
      alertError(
        null,
        `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
      );
      return false;
    }
    return true;
  }

  public async LockWithDIDAndPwd(
    sessionItem: ISessionItem,
    serviceEndpoint: string
  ) {
    let newSessionItem = sessionItem;
    if (
      !newSessionItem.passhash ||
      newSessionItem.passhash.trim().length === 0
    ) {
      newSessionItem.passhash = CryptoJS.SHA256(newSessionItem.did).toString(
        CryptoJS.enc.Hex
      );
    }

    const res = await this.SearchUserWithDID(sessionItem.did);
    if (res) {
      newSessionItem.onBoardingCompleted = res.onBoardingCompleted;
      newSessionItem.tutorialStep = res.tutorialStep;
      newSessionItem.referrals = res.referrals || [];
      newSessionItem.wallets = res.wallets || {};
    }

    this.lockUser(UserService.key(newSessionItem.did), newSessionItem);
    window.localStorage.setItem('isLoggedIn', 'true');

    return await UserVaultScriptService.register(
      newSessionItem,
      serviceEndpoint
    );
  }

  public async UnLockWithDIDAndPwd(
    did: string,
    storePassword: string,
    showAlert = true
  ) {
    let instance = this.unlockUser(UserService.key(did), storePassword);
    if (!instance) return null;
    let isHiveVersionValid = await this.isHiveVersionValid(instance);
    if (!isHiveVersionValid) return null;

    const res = await this.SearchUserWithDID(did);

    if (!res) {
      if (showAlert) alertError(null, 'Could not find user with this DID');
    } else if (instance) {
      instance.onBoardingCompleted = res.onBoardingCompleted;
      instance.tutorialStep = res.tutorialStep;
      instance.referrals = res.referrals || [];
      instance.wallets = res.wallets || {};
      this.lockUser(UserService.key(instance.did), instance);

      window.localStorage.setItem('isLoggedIn', 'true');
      return await UserVaultScriptService.register(instance, instance.hiveHost);
    }
    return null;
  }

  public async validateWithPwd(did: string, storePassword: string) {
    let instance = this.unlockUser(UserService.key(did), storePassword, false);
    console.log('===>instance', UserService.key(did), instance);

    if (!instance) {
      return false;
    }
    let isHiveVersionValid = await this.isHiveVersionValid(instance);
    console.log('===>isHiveVersionValid', isHiveVersionValid);

    if (!isHiveVersionValid) {
      return false;
    }
    console.log('===>isHiveVersionValid', instance.did, did);
    return instance.did === did;
  }

  public static logout() {
    window.localStorage.removeItem('isLoggedIn');
    window.localStorage.removeItem('persist:root');

    let connector: EssentialsConnector = connectivity.getActiveConnector() as EssentialsConnector;
    if (connector && connector.hasWalletConnectSession()) {
      connector.disconnectWalletConnect();
    }
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
