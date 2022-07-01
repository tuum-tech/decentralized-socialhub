import {
  JSONObject,
  VerifiableCredential,
  DIDDocument
} from '@elastosfoundation/did-js-sdk/';
import request, { BaseplateResp } from 'src/baseplate/request';
import { HiveService } from './hive.service';

export enum CredentialType {
  Google = 'Google',
  Facebook = 'Facebook',
  Twitter = 'Twitter',
  Linkedin = 'Linkedin',
  Github = 'Github',
  Reddit = 'Reddit',
  Discord = 'Discord',
  Twitch = 'Twitch',
  Apple = 'Apple',
  Line = 'Line',
  Kakao = 'Kakao',
  Weibo = 'Weibo',
  Wechat = 'Wechat',
  Email = 'Email',

  Education = 'Education',
  Experience = 'Experience',
  PersonalInfo = 'PersonalInfo',

  ETHAddress = 'ETHAddress',
  ESCAddress = 'ESCAddress'
}

export class DidcredsService {
  static async getSocialCredentials(
    didDocument: DIDDocument
  ): Promise<VerifiableCredential[]> {
    return didDocument.getCredentials();
  }

  static async generateVerifiableCredential(
    did: string,
    credential_type: string,
    credential_value: string
  ): Promise<VerifiableCredential> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/didcreds_router/generateVerifiedCredFromTuum`;
    let data = {
      did: did,
      credential_type: credential_type.toLowerCase(),
      credential_value: credential_value
    };

    let postData: any = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: process.env.REACT_APP_PROFILE_API_SERVICE_KEY
      },
      body: JSON.stringify(data)
    };
    let response = await fetch(url, postData);

    let json = await response.json();

    return await VerifiableCredential.parse(json.data.verifiable_credential);
  }

  static async requestGoogleLogin(): Promise<BaseplateResp> {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/google_request`,
      {
        headers: {
          'content-type': 'text/plain',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
          Accept: 'application/json'
        }
      }
    );
  }

  static async addOrUpdateCredentialToVault(
    sessionItem: ISessionItem,
    vc: VerifiableCredential
  ): Promise<void> {
    let hiveClient = await HiveService.getSessionInstance(sessionItem);
    await hiveClient?.Scripting.RunScript<any>({
      name: 'add_verifiablecredential',
      context: {
        target_did: sessionItem.did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      },
      params: {
        id: vc.getId().toString(),
        vc: vc.toJSON()
      }
    });
  }

  static async removeCredentialToVault(
    sessionItem: ISessionItem,
    vcKey: string
  ): Promise<void> {
    let hiveClient = await HiveService.getSessionInstance(sessionItem);
    await hiveClient?.Scripting.RunScript<any>({
      name: 'remove_verifiablecredential',
      context: {
        target_did: sessionItem.did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      },
      params: {
        id: vcKey
      }
    });
  }

  static async getAllCredentialsToVault(
    sessionItem: ISessionItem
  ): Promise<Map<string, VerifiableCredential>> {
    let hiveClient = await HiveService.getSessionInstance(sessionItem);
    let hiveResponse = await hiveClient?.Scripting.RunScript<any>({
      name: 'get_verifiable_credentials',
      context: {
        target_did: sessionItem.did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      }
    });

    let response = new Map<string, VerifiableCredential>();

    if (!hiveResponse?.isSuccess) return response;

    var collection = hiveResponse.response.get_verifiable_credentials.items;

    collection.forEach((item: { vc: string | JSONObject }) => {
      var vc = VerifiableCredential.parse(item.vc);
      response.set(vc.getId().toString(), vc);
    });

    return response;
  }
  static async getCredentialValue(session: ISessionItem, key: string) {
    const creds = await this.getAllCredentialsToVault(session);
    const id = `${session.did}#${key}`;
    const vc = creds.get(id);
    return vc
      ? vc.getIssuer().toString() === process.env.REACT_APP_APPLICATION_DID
        ? vc.subject.getProperty(key)
        : ''
      : '';
  }
}
