import { DidDocumentService } from './diddocument.service';
import { HiveClient, AppContextParameters } from '@tuum-tech/hive-js-sdk';
import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';
import { DID as CNDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import {
  DIDDocument,
  DIDStore,
  VerifiablePresentation
} from '@elastosfoundation/did-js-sdk/';
import {
  HiveClient,
  OptionsBuilder,
  IOptions
} from '@elastosfoundation/elastos-hive-js-sdk';
import jwt_decode from 'jwt-decode';

import { DidService } from './did.service.new';

import { CacheManager, Logger } from '@tuum-tech/commons.js.tools';

import { UserDocumentNotPublishedException } from 'src/shared-base/exceptions';

export const appParameters: any = {
  hiveHost: process.env.REACT_APP_HIVE_HOST as string,
  resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
  resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
  context: {
    storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
    appDID: process.env.REACT_APP_APPLICATION_DID,
    appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
    appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
    appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
    userDID: process.env.REACT_APP_APPLICATION_DID,
    userMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
    userPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
    userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
  } as AppContextParameters
};

export interface IHiveChallenge {
  issuer: string;
  nonce: string;
}
export class HiveService {
  private static LOG = new Logger('HiveService');

  static async getApplicationHiveClient(
    hiveHost?: string
  ): Promise<HiveClient | null> {
    try {
      if (hiveHost !== undefined && hiveHost !== '') {
        let hiveClient = CacheManager.get(
          'ApplicationHiveClient'
        ) as HiveClient;

        if (!hiveClient) {
          hiveClient = await HiveClient.createInstance(appParameters);
        }
        return hiveClient;
      }
    } catch (e) {
      HiveService.LOG.error('Cannot authenticate with Hive: {}', e);
      return null;
    }
    return null;
  }

  static async getHiveClient(
    session: ISessionItem
  ): Promise<HiveClient | null> {
    HiveService.LOG.trace('getHiveClient');
    try {
      let hiveClientParameters: any = {
        hiveHost: session.hiveHost,
        context: {
          userDID: session.did
        }
      } as any;
      let hiveClient = CacheManager.get('HiveClient') as HiveClient;

      if (!hiveClient) {
        let isUserDocumentPublished = await DidDocumentService.isDidDocumentPublished(
          session.did
        );

        if (!isUserDocumentPublished) {
          throw new UserDocumentNotPublishedException();
        }

        hiveClient = await HiveClient.createInstance(hiveClientParameters);
      }
      return hiveClient;
    } catch (e) {
      HiveService.LOG.error('Cannot authenticate with Hive: {}', e);
      return null;
    }
  }

  static async getAnonymousHiveClient(
    hiveHost?: string
  ): Promise<HiveClient | undefined> {
    HiveService.LOG.trace('getReadOnlyUserHiveClient');
    try {
      let host = hiveHost ? hiveHost : process.env.REACT_APP_HIVE_HOST;
      //return await HiveClient.createAnonymousInstance(host!);
    } catch (e) {
      HiveService.LOG.error('getReadOnlyUserHiveClient: {}', e);
    }
    return;
  }

  static async isHiveAddressValid(address: string): Promise<boolean> {
    HiveService.LOG.trace('isHiveAddressValid');
    try {
      await HiveClient.getHiveVersion(address);
    } catch (error) {
      HiveService.LOG.error('Cannot connect to Hive Node.', error);
      return false;
    }
    return true;
  }

  static async isHiveVersionSupported(version: string): Promise<boolean> {
    HiveService.LOG.trace('isHiveVersionSupported');
    let pattern = /[v\s]*/gi;
    let minVersion = process.env.REACT_APP_HIVE_MIN_VERSION?.replace(
      pattern,
      ''
    ).split('.');
    let maxVersion = process.env.REACT_APP_HIVE_MAX_VERSION?.replace(
      pattern,
      ''
    ).split('.');
    let actualVersion = version?.replace(pattern, '').split('.');

    if (minVersion === undefined || maxVersion === undefined) return false;

    let majorMin = Number(minVersion[0]);
    let majorMax = Number(maxVersion[0]);
    let majorActual = Number(actualVersion[0]);

    if (majorActual < majorMin || majorActual > majorMax) return false;

    let minorMin = Number(minVersion[1]);
    let minorMax = Number(maxVersion[1]);
    let minorActual = Number(actualVersion[1]);

    if (majorActual === majorMin && minorActual < minorMin) return false;
    if (majorActual === majorMax && minorActual > minorMax) return false;

    let versionMin = Number(minVersion[2]);
    let versionMax = Number(maxVersion[2]);
    let versionActual = Number(actualVersion[2]);

    if (
      majorActual === majorMin &&
      minorActual === minorMin &&
      versionActual < versionMin
    )
      return false;
    if (
      majorActual === majorMax &&
      minorActual === minorMax &&
      versionActual > versionMax
    )
      return false;

    return true;
  }

  static async isHiveVersionSet(version: string): Promise<boolean> {
    HiveService.LOG.trace('isHiveVersionSet');
    if (version === `0.0.0`)
      // default if HIVE_VERSION not set
      return false;

    return true;
  }
}
