import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import request, { BaseplateResp } from 'src/baseplate/request';
import { HiveService } from './hive.service';

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
  static async generateVerifiableCredential(
    did: string,
    credential_type: string,
    credential_value: string
  ): Promise<VerifiableCredential> {
    let url = `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/didcreds_router/validation/internet_account`;
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
    let hiveClient = await HiveService.getSessionInstance(sessionItem);
    let hiveResponse = await hiveClient?.Scripting.RunScript<any>({
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
    let hiveResponse = await hiveClient?.Scripting.RunScript<any>({
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
}
