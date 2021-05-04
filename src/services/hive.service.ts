import {
  HiveClient,
  OptionsBuilder,
  IOptions
} from '@elastos/elastos-hive-js-sdk';
import jwt_decode from 'jwt-decode';
import { alertError } from 'src/utils/notify';

import { DidService } from './did.service';
import { DidDocumentService } from './diddocument.service';
import { UserService } from './user.service';
export interface IHiveChallenge {
  issuer: string;
  nonce: string;
}
export class HiveService {
  static async getSessionInstance(): Promise<HiveClient | undefined> {
    try {
      let instance = UserService.GetUserSession();
      if (!instance) return;

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

      if (hiveClient && hiveClient.isConnected) {
        await hiveClient.Payment.CreateFreeVault();
      }
      return hiveClient;
    } catch (e) {
      return;
    }
  }

  static async isHiveAddressValid(address: string): Promise<boolean> {
    try {
      let challenge = await HiveService.getHiveChallenge(address);
      let isValid: boolean =
        challenge.nonce !== undefined && challenge.nonce.length > 0;
      return isValid;
    } catch (error) {
      return false;
    }
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
    let appDid = await DidService.loadDid(mnemonic);
    let builder = new OptionsBuilder();
    await builder.setAppInstance(appId, appDid);
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
    let appDid = await DidService.loadDid(mnemonic);
    let appDocument = await DidService.getDidDocument(appDid.did, false);

    let response = await HiveClient.getApplicationChallenge(
      options,
      this.copyDocument(appDocument)
    );

    let jwt = jwt_decode<any>(response.challenge);

    return {
      issuer: jwt.iss,
      nonce: jwt.nonce
    };
  }

  static async getUserHiveToken(
    hiveHost: string,
    presentation: any
  ): Promise<string> {
    let options = await this.getHiveOptions(hiveHost);
    return await HiveClient.getAuthenticationToken(options, presentation);
  }
}
