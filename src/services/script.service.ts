import request from 'src/baseplate/request';
import { UserVaultScripts } from 'src/scripts/uservault.script';

import { UserService, AccountType } from './user.service';
import { HiveService } from './hive.service';
import { DidService } from './did.service';
import { alertError } from 'src/utils/notify';
import { StyleHTMLAttributes } from 'react';

export class TuumTechScriptService {
  private static async runTuumTechScript(script: any) {
    return request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/tuumvault_router/scripting/run_script`,
      {
        method: 'POST',
        headers: {
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
          Accept: 'application/json',
          charset: 'utf8',
          'content-type': 'application/json'
        },
        body: JSON.stringify(script)
      }
    );
  }

  private static async getUsersWithRegisteredCredential(
    credential: string,
    credentialType: string
  ) {
    const get_users_scripts = {
      name: 'get_users_by_' + credentialType,
      params: {
        filter: credential
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };

    let get_users_script_response: any = await this.runTuumTechScript(
      get_users_scripts
    );

    let prevUsers = [];
    const { meta, data } = get_users_script_response;
    if (meta && meta.code === 200 && meta.message === 'OK') {
      const { users_found } = data;
      if (users_found && users_found.items && users_found.items.length > 0) {
        prevUsers = users_found.items.map((userItem: any) => {
          const newUserItem = {
            status: userItem.status || '',
            did: userItem.did || '',
            email: TuumTechScriptService.getValueFromLoginCred(
              userItem,
              'email'
            ),
            facebook: TuumTechScriptService.getValueFromLoginCred(
              userItem,
              'facebook'
            ),
            google: TuumTechScriptService.getValueFromLoginCred(
              userItem,
              'google'
            ),
            twitter: TuumTechScriptService.getValueFromLoginCred(
              userItem,
              'twitter'
            ),
            linkedin: TuumTechScriptService.getValueFromLoginCred(
              userItem,
              'linkedin'
            ),
            _id: userItem._id.$oid || ''
          };
          return newUserItem;
        });
      }
    } else {
      // throw new Error('Error while running get_users script')
      return [];
    }
    return prevUsers;
  }

  private static getValueFromLoginCred(userItem: any, credType: string) {
    if (!userItem || !userItem.loginCred || !userItem.loginCred[credType])
      return '';
    return userItem.loginCred[credType];
  }

  public static async getUsersWithRegisteredEmail(email: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      email,
      'email'
    );
  }

  public static async getUsersWithRegisteredFacebook(facebook: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      facebook,
      'facebook'
    );
  }

  public static async getUsersWithRegisteredGoogle(google: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      google,
      'google'
    );
  }

  public static async getUsersWithRegisteredTwitter(twitter: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      twitter,
      'twitter'
    );
  }

  public static async getUsersWithRegisteredLinkedin(linkedin: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      linkedin,
      'linkedin'
    );
  }

  public static async searchUserWithDID(did: string) {
    const get_user_by_did_script = {
      name: 'get_user_by_did',
      params: {
        did
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(get_user_by_did_script);
    return response;
  }

  public static async updateUserDidInfo(params: ISessionItem) {
    const add_user_script = {
      name: 'update_user_did_info',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(add_user_script);
    return response;
  }

  // Update user created from email flow. The update do not filter by DID because this user doesn't have one yet
  public static async updateEmailUserDidInfo(params: ISessionItem) {
    const update_emailuser_script = {
      name: 'update_emailuser_did_info',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(update_emailuser_script);
    console.log('====>response', response);

    return response;
  }

  public static async addUserToTuumTech(params: ISessionItem) {
    const add_user_script = {
      name: 'add_user',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(add_user_script);
    console.log('=====>response', response);
    return response;
  }

  public static async updateBasicProfile(basicDTO: ISessionItem) {
    const update_user_script = {
      name: 'update_user',
      params: basicDTO,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(update_user_script);
    const { data, meta } = response;
    if (meta.code === 200 && meta.message === 'OK') {
    }
    return response;
  }
}

export class UserVaultScriptService {
  private static async generateUserToken(mnemonics: string, address: string) {
    let challenge = await HiveService.getHiveChallenge(address);
    let presentation = await DidService.generateVerifiablePresentationFromUserMnemonics(
      mnemonics,
      '',
      challenge.issuer,
      challenge.nonce
    );
    const userToken = await HiveService.getUserHiveToken(address, presentation);
    return userToken;
  }

  public static async register() {
    let user = UserService.GetUserSession();
    if (!user) return;
    let response = await TuumTechScriptService.searchUserWithDID(user.did);
    if (
      response.data &&
      response.data.get_user_by_did &&
      response.data.get_user_by_did.items &&
      response.data.get_user_by_did.items.length > 0
    ) {
      const userInfo = response.data.get_user_by_did.items[0];
      if (
        !userInfo.tutorialStep ||
        userInfo.tutorialStep !== 4 ||
        !userInfo.onBoardingCompleted
      )
        return;

      try {
        let userToken = await this.generateUserToken(
          user.mnemonics,
          user.hiveHost
        );
        user.userToken = userToken;
        await UserService.updateSession(user);
        let hiveInstance = await HiveService.getSessionInstance();
        await UserVaultScripts.Execute(hiveInstance!);
      } catch (error) {
        console.log('Could not register: ' + error);
        alertError(null, 'Could not register');
      }
    }
  }
}
