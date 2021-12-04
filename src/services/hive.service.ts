import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';
import { DIDAccess } from '@elastosfoundation/elastos-connectivity-sdk-js/typings/did';
import {
  DID as CNDID,
  connectivity
} from '@elastosfoundation/elastos-connectivity-sdk-js';
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
//import { VerifiablePresentation } from '@elastosfoundation/did-js-sdk/typings';
import jwt_decode from 'jwt-decode';

import { DidService } from './did.service.new';
import { DidDocumentService } from './diddocument.service';

export interface IHiveChallenge {
  issuer: string;
  nonce: string;
}
export class HiveService {
  static async getSessionInstance(
    instance: ISessionItem
  ): Promise<HiveClient | undefined> {
    try {
      let isUserDocumentPublished = await DidDocumentService.isDidDocumentPublished(
        instance.did
      );

      if (!isUserDocumentPublished) {
        return;
      }

      let hiveClient = await HiveClient.createInstance(
        instance.userToken,
        instance.hiveHost
      );

      return hiveClient;
    } catch (e) {
      return;
    }
  }

  static async isHiveAddressValid(
    address: string,
    isEssentialsUser: boolean
  ): Promise<boolean> {
    try {
      let challenge = await HiveService.getHiveChallenge(
        address,
        isEssentialsUser
      );
      console.log('challenge: ', challenge);
      let isValid: boolean =
        challenge.nonce !== undefined && challenge.nonce.length > 0;
      return isValid;
    } catch (error) {
      console.log('error: ', error);
      return false;
    }
  }

  static async getHiveVersion(address: string): Promise<string> {
    const response = await fetch(`${address}/api/v1/hive/version`, {
      method: 'GET'
    });

    const { version } = await response.json();

    return version;
  }

  static async isHiveVersionSupported(version: string): Promise<boolean> {
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
    if (version === `0.0.0`)
      // default if HIVE_VERSION not set
      return false;

    return true;
  }

  static async getAppHiveClient(): Promise<HiveClient | undefined> {
    try {
      let host = `${process.env.REACT_APP_TUUM_TECH_HIVE}`;
      let hiveClient = await HiveClient.createAnonymousInstance(host);
      return hiveClient;
    } catch (e) {}
    return;
  }

  static async getReadOnlyUserHiveClient(
    hiveHost: string
  ): Promise<HiveClient | undefined> {
    try {
      let hiveClient = await HiveClient.createAnonymousInstance(hiveHost);
      return hiveClient;
    } catch (e) {}
    return;
  }

  private static async getHiveOptions(
    hiveHost: string,
    isEssentialUser: boolean
  ): Promise<IOptions> {
    //TODO: change to appInstance
    let builder = new OptionsBuilder();
    let mnemonic = '';
    let appDid = '';
    if (isEssentialUser) {
      // let didAccess = new CNDID.DIDAccess();
      // let response = await didAccess.getExistingAppInstanceDIDInfo()
      mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
      appDid = `${process.env.REACT_APP_APPLICATION_ID}`;
    } else {
      mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
      appDid = `${process.env.REACT_APP_APPLICATION_ID}`;
    }

    let a = await ElastosClient.did.loadFromMnemonic(mnemonic, '');
    await builder.setAppInstance(appDid, {
      did: appDid,
      privateKey: a.privateKey
    });

    builder.setHiveHost(hiveHost);
    return builder.build();
  }

  private static copyDocument(document: any): any {
    let newItem: any = {};
    Object.getOwnPropertyNames(document).forEach(function(key) {
      newItem[key] = document[key];
    }, document);

    return newItem;
  }

  static async getHiveChallenge(
    hiveHost: string,
    isEssentialUser: boolean
  ): Promise<IHiveChallenge> {
    let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    let options = await this.getHiveOptions(hiveHost, isEssentialUser);
    let didService = await DidService.getInstance();
    let docChallenge: any;
    if (isEssentialUser) {
      let didAccess = new CNDID.DIDAccess();
      let response = await didAccess.getExistingAppInstanceDIDInfo();
      console.log(response);
      let didStore = await DIDStore.open(response.storeId);

      let document = await didStore.loadDid(response.didString);

      docChallenge = JSON.parse(document.toString(true));
    } else {
      let appDid = await didService.loadDid(mnemonic);
      let appDocument = await didService.getDidDocument(appDid, false);
      docChallenge = JSON.parse(appDocument.toString(true));

      if (!appDocument.isValid()) {
        docChallenge.verifiableCredential.forEach((vc: any) => {
          delete vc.proof.created;
        });

        let didDocumentFixed = await DIDDocument.parseAsync(
          JSON.stringify(docChallenge)
        );
        if (!didDocumentFixed.isValid) {
          console.error('doc is not valid');
        }
      }
    }

    let response = await HiveClient.getApplicationChallenge(
      options,
      docChallenge
    );

    let jwt = jwt_decode<any>(response.challenge);
    return {
      issuer: jwt.iss,
      nonce: jwt.nonce
    };
  }

  static async getUserHiveToken(
    hiveHost: string,
    presentation: VerifiablePresentation,
    isEssentialUser: boolean
  ): Promise<string> {
    let options = await this.getHiveOptions(hiveHost, isEssentialUser);
    return await HiveClient.getAuthenticationToken(
      options,
      JSON.parse(presentation.toString(true))
    );
  }
}
