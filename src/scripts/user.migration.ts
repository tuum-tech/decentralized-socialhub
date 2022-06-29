import {
  DeleteExecutable,
  Executable,
  FindExecutable,
  InsertExecutable,
  UpdateExecutable,
  HiveClient,
  AppContextParameters
} from '@tuum-tech/hive-js-sdk/';
import parallel from 'async/parallel';
import { HiveClientParameters } from '@tuum-tech/hive-js-sdk/typings/hiveclient';

export class UserVaultMigration {
  static defaultParameters: HiveClientParameters = {
    hiveHost: process.env.REACT_APP_HIVE_HOST as string,
    resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
    resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
    context: {
      storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
      appDID: process.env.REACT_APP_APPLICATION_DID,
      appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
      appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
      appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
      userDID: '',
      userMnemonics: '',
      userPhrasePass: '',
      userStorePass: ''
    } as AppContextParameters
  };

  static async Migrate(
    hiveClient: HiveClient,
    hiveHost: string,
    userDid: string,
    oldAppDid: string,
    newAppDid: string
  ) {
    let oldUserVaultParameters: HiveClientParameters = {
      hiveHost: process.env.REACT_APP_HIVE_HOST as string,
      resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
      resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
      context: {
        storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
        appDID: process.env.REACT_APP_APPLICATION_DID,
        appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
        appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
        appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
        userDID: '',
        userMnemonics: '',
        userPhrasePass: '',
        userStorePass: ''
      } as AppContextParameters
    };
    let oldClient = await HiveClient.createInstance();
  }

  static async SetupVaults(
    hiveClient: HiveClient,
    hiveHost: string,
    userDid: string,
    oldMnemonics: string,
    oldAppDid: string,
    newAppDid: string
  ) {
    UserVaultMigration.SetupOldAppVault(oldAppDid, oldMnemonics);
  }

  static async SetupOldAppVault(oldAppDid: string, oldMnemonics: string) {
    let oldAppUserParameters = {
      ...UserVaultMigration.defaultParameters,
      appMnemonics: oldMnemonics,
      appDID: oldAppDid,
      appPhrasePass: ''
    };
  }
}
