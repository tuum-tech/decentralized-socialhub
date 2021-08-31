import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';

import {
  DIDDocument,
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

      // if (hiveClient && hiveClient.isConnected) {
      //   await hiveClient.Payment.CreateFreeVault();
      // }
      return hiveClient;
    } catch (e) {
      return;
    }
  }

  static async isHiveAddressValid(address: string): Promise<boolean> {
    try {
      let challenge = await HiveService.getHiveChallenge(address);
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
    let supportedVersions = process.env.REACT_APP_HIVE_VALID_VERSION?.replace(
      /\s/g,
      ''
    ).split(',');

    return supportedVersions?.includes(version) as boolean;
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

  private static async getHiveOptions(hiveHost: string): Promise<IOptions> {
    //TODO: change to appInstance
    let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    let appId = `${process.env.REACT_APP_APPLICATION_ID}`;
    let didService = await DidService.getInstance();
    let appDid = await didService.loadDid(mnemonic);
    let builder = new OptionsBuilder();

    let a = await ElastosClient.did.loadFromMnemonic(mnemonic, '');
    let pk = await didService.getPrivateKey(appDid.toString());
    await builder.setAppInstance(appId, {
      did: appDid.toString(),
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

  static async getHiveChallenge(hiveHost: string): Promise<IHiveChallenge> {
    let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    let options = await this.getHiveOptions(hiveHost);
    let didService = await DidService.getInstance();
    let appDid = await didService.loadDid(mnemonic);
    let appDocument = await didService.getDidDocument(appDid, false);
    let docChallenge = JSON.parse(appDocument.toString(true));

    //console.log("is challenge valid:" + appDocument.isValid());
    //console.log("DOC Chalenge before:" + JSON.stringify(docChallenge));

    if (!appDocument.isValid()) {
      docChallenge.verifiableCredential.forEach((vc: any) => {
        delete vc.proof.created;
      });

      let didDocumentFixed = await DIDDocument.parseContent(
        JSON.stringify(docChallenge)
      );
      if (!didDocumentFixed.isValid) {
        console.error('doc is not valid');
      }
    }
    //console.log("DOC Chalenge after:" + JSON.stringify(docChallenge));

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
    presentation: VerifiablePresentation
  ): Promise<string> {
    let options = await this.getHiveOptions(hiveHost);
    return await HiveClient.getAuthenticationToken(
      options,
      JSON.parse(presentation.toString(true))
    );
  }
}
