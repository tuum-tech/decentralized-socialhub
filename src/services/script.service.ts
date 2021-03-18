import request from 'src/baseplate/request';
import { UserVaultScripts } from 'src/scripts/uservault.script';

import { UserService, ISessionItem, AccountType } from './user.service';
import { HiveService } from './hive.service';
import { DidService } from './did.service';
import { BasicDTO } from 'src/pages/PublicPage/types';
import { alertError } from 'src/utils/notify';

interface TuumScriptUpdateDidUserParams {
  email: string;
  code: string;
  did: string;
  hiveHost: string;
  accountType: string;
  userToken: string;
  tutorialCompleted: boolean;
}

interface TuumScriptAddDidUserParams {
  name: string;
  email: string;
  status: string;
  code: string;
  did: string;
  hiveHost: string;
  accountType: AccountType;
  userToken: string;
  tutorialCompleted: boolean;
}

interface TuumScriptUpdateUserParams {
  did: string;
  name: string;
  email: string;
  onBoardingCompleted: boolean;
}
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

  public static async getUsersWithRegisteredEmail(email: string) {
    const get_users_scripts = {
      name: 'get_users_by_email',
      params: {
        email: email
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
      const { get_users_by_email } = data;
      if (
        get_users_by_email &&
        get_users_by_email.items &&
        get_users_by_email.items.length > 0
      ) {
        prevUsers = get_users_by_email.items.map((userItem: any) => {
          const newUserItem = {
            status: userItem.status || '',
            did: userItem.did || '',
            email: userItem.email || '',
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

  public static async updateUserDidInfo(params: TuumScriptUpdateDidUserParams) {
    const add_user_script = {
      name: 'update_user_did_info',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response = await this.runTuumTechScript(add_user_script);
    console.log('update_user_did_info response', response);
  }

  public static async addUserToTuumTech(params: TuumScriptAddDidUserParams) {
    const add_user_script = {
      name: 'add_user',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    await this.runTuumTechScript(add_user_script);
  }

  public static async updateUser(params: TuumScriptUpdateUserParams) {
    const update_user_script = {
      name: 'update_user',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    await this.runTuumTechScript(update_user_script);
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
      if (!userInfo.tutorialCompleted) return;
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
        alertError(null, error);
      }
    }
  }
}
