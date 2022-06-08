import { DidDocumentService } from './diddocument.service';
import {
  Logger,
  CacheManager,
  HiveClient,
  HiveClientParameters,
  appParameters
} from '@dchagastelles/commons.js.tools';
import { UserDocumentNotPublishedException } from 'src/shared-base/exceptions';

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
      let applicationParameters: HiveClientParameters = appParameters;
      if (hiveHost !== undefined && hiveHost !== '') {
        appParameters.hiveHost = hiveHost;
      }

      let hiveClient = CacheManager.get('ApplicationHiveClient');

      if (!hiveClient) {
        hiveClient = await HiveClient.createInstance(applicationParameters);
      }
      return hiveClient;
    } catch (e) {
      HiveService.LOG.error('Cannot authenticate with Hive: {}', e);
      return null;
    }
  }

  static async getHiveClient(
    session: ISessionItem
  ): Promise<HiveClient | null> {
    HiveService.LOG.trace('getHiveClient');
    try {
      let hiveClientParameters: HiveClientParameters = {
        hiveHost: session.hiveHost,
        context: {
          userDID: session.did
        }
      } as HiveClientParameters;
      let hiveClient = CacheManager.get('HiveClient');

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
