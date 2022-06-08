import {
  JSONObject,
  VerifiableCredential,
  DIDDocument
} from '@elastosfoundation/did-js-sdk/';
import request, { BaseplateResp } from 'src/baseplate/request';
import { HiveService } from './hive.service';
import { HiveClient } from '@dchagastelles/commons.js.tools';

export enum CredentialType {
  Linkedin = 'Linkedin',
  Facebook = 'Facebook',
  Google = 'Google',
  Twitter = 'Twitter',
  Github = 'Github',
  Discord = 'Discord',
  Email = 'Email',
  DID = 'Did',
  Education = 'Education',
  Experience = 'Experience',
  PersonalInfo = 'PersonalInfo',
  ETHAddress = 'ETHAddress',
  EIDAddress = 'EIDAddress',
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

  static async requestLinkedinLogin(): Promise<BaseplateResp> {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/linkedin_request`,
      {
        headers: {
          'content-type': 'text/plain',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
          Accept: 'application/json'
        }
      }
    );
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

  static async requestFacebookLogin(): Promise<BaseplateResp> {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/facebook_request`,
      {
        headers: {
          'content-type': 'text/plain',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
          Accept: 'application/json'
        }
      }
    );
  }

  static async requestGithubLogin(): Promise<BaseplateResp> {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/github_request`,
      {
        headers: {
          'content-type': 'text/plain',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
          Accept: 'application/json'
        }
      }
    );
  }

  static async requestDiscordLogin(): Promise<BaseplateResp> {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/discord_request`,
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
    let hiveClient: HiveClient = (await HiveService.getHiveClient(
      sessionItem
    )) as HiveClient;
    let hiveResponse = await hiveClient?.Scripting.callScript<any>(
      'add_verifiablecredential',
      {
        id: vc.getId().toString(),
        vc: vc.toJSON()
      },
      sessionItem.did,
      `${process.env.REACT_APP_APPLICATION_DID}`
    );

    console.log(hiveResponse);
  }

  static async removeCredentialToVault(
    sessionItem: ISessionItem,
    vcKey: string
  ): Promise<void> {
    let hiveClient = (await HiveService.getHiveClient(
      sessionItem
    )) as HiveClient;
    let hiveResponse = await hiveClient?.Scripting.callScript<any>(
      'remove_verifiablecredential',

      {
        id: vcKey
      },
      sessionItem.did,
      `${process.env.REACT_APP_APPLICATION_DID}`
    );

    console.log(hiveResponse);
  }

  static async getAllCredentialsToVault(
    sessionItem: ISessionItem
  ): Promise<Map<string, VerifiableCredential>> {
    let hiveClient = (await HiveService.getHiveClient(
      sessionItem
    )) as HiveClient;
    let hiveResponse = await hiveClient?.Scripting.callScript<any>(
      'get_verifiable_credentials',
      {},
      sessionItem.did,
      `${process.env.REACT_APP_APPLICATION_ID}`
    );

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
