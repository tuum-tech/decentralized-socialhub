import request from 'src/baseplate/request';
import { UserVaultScripts } from 'src/scripts/uservault.script';

import { UserService } from './user.service';
import { HiveService } from './hive.service';
import { DidService } from './did.service.new';
import { getItemsFromData } from 'src/utils/script';
import { Guid } from 'guid-typescript';

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

  public static async getAllUsers() {
    const script = {
      name: 'get_all_users',
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    const { data }: any = await this.runTuumTechScript(script);
    if (data._status !== 'OK') return [];
    const users = data.get_all_users.items;
    return users;
  }

  private static async getUsersWithRegisteredCredential(
    credential: string,
    credentialType: string
  ) {
    const get_users_scripts = {
      name: 'get_users_by_' + credentialType,
      params: {
        filter: credential,
        limit: 200,
        skip: 0
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
      if (data) {
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
              github: TuumTechScriptService.getValueFromLoginCred(
                userItem,
                'github'
              ),
              discord: TuumTechScriptService.getValueFromLoginCred(
                userItem,
                'discord'
              ),
              _id: userItem._id.$oid || ''
            };
            return newUserItem;
          });
        }
      } else {
        return [];
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

  public static async getUsersWithRegisteredGithub(github: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      github,
      'github'
    );
  }

  public static async getUsersWithRegisteredDiscord(discord: string) {
    return TuumTechScriptService.getUsersWithRegisteredCredential(
      discord,
      'discord'
    );
  }

  public static async searchUserWithDIDs(
    dids: string[],
    limit = 200,
    skip = 0
  ) {
    const get_user_by_did_script = {
      name: 'get_users_by_dids',
      params: {
        dids: dids,
        limit,
        skip
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(get_user_by_did_script);
    return getItemsFromData(response, 'get_users_by_dids');
  }

  public static async updateTuumUser(params: ISessionItem) {
    const update_user_script = {
      name: 'update_user',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(update_user_script);
    return response;
  }

  // Update user created from email flow. The update do not filter by DID because this user doesn't have one yet
  public static async updateTuumEmailUser(params: ISessionItem) {
    const update_emailuser_script = {
      name: 'update_email_user',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(update_emailuser_script);
    return response;
  }

  public static async addFeedback(did: string, feedbacks: string) {
    const add_feedback_script = {
      name: 'add_feedback',
      params: {
        did,
        feedbacks,
        createdAt: new Date().toUTCString()
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(add_feedback_script);
    return response;
  }

  public static async addReferral(toDid: string, did: string) {
    if (toDid !== '') {
      // retrive user's referrals first
      const users = await TuumTechScriptService.searchUserWithDIDs([toDid]);

      if (users.length > 0) {
        let referrals = users[0].referrals || [];

        if (!referrals.map((r: IReferral) => r.did).includes(did)) {
          referrals.push({ did });
        }

        if (referrals.length > 0) {
          let newUser = users[0];
          newUser.referrals = referrals;
          await TuumTechScriptService.updateTuumUser(newUser);
        }
      }
    }
  }

  public static async completeReferralTutorial(toDid: string, did: string) {
    if (toDid !== '') {
      // retrive user's referrals first
      const users = await TuumTechScriptService.searchUserWithDIDs([toDid]);

      if (
        users.length > 0 &&
        users[0].referrals &&
        users[0].referrals.length > 0
      ) {
        let referrals = users[0].referrals || [];
        let index = referrals.findIndex((r: IReferral) => r.did === did);

        if (index > -1) {
          referrals[index].sign_up_date = new Date();

          let newUser = users[0];
          newUser.referrals = referrals;
          await TuumTechScriptService.updateTuumUser(newUser);
        }
      }
    }
  }

  public static async getReferrals(did: string) {
    let referrals: IReferral[] = [];
    if (did !== '') {
      // retrive user's referrals first
      const users = await TuumTechScriptService.searchUserWithDIDs([did]);

      if (
        users.length > 0 &&
        users[0].referrals &&
        users[0].referrals.length > 0
      ) {
        referrals = users[0].referrals;

        if (referrals.length > 0) {
          let newUser = users[0];
          newUser.referrals = referrals;
          await TuumTechScriptService.updateTuumUser(newUser);
        }
      }
    }

    return referrals;
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
    return response;
  }

  public static async addGithubComment(params: IGithubCommentItem) {
    const add_comment_script = {
      name: 'add_comment',
      params,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(add_comment_script);
    return response;
  }

  public static async getGithubCommentsByIssueId(
    githubIssueId: number,
    limit = 200,
    skip = 0
  ) {
    const get_user_by_did_script = {
      name: 'get_comments_by_github_issue_id',
      params: {
        githubIssueId: githubIssueId,
        limit,
        skip
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };
    let response: any = await this.runTuumTechScript(get_user_by_did_script);
    return getItemsFromData(response, 'get_comments_by_github_issue_id');
  }

  // verification scripts
  public static async addVerificationRequest(
    from_did: string,
    to_did: string,
    data: VerificationData,
    msg: string,
    idKey: string
  ) {
    const add_verification_request_script = {
      name: 'add_verification',
      params: {
        from_did,
        to_did,
        category: data.category,
        records: data.records,
        msg,
        idKey,
        guid: Guid.create()
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };

    await this.runTuumTechScript(add_verification_request_script);
  }

  public static async updateVerificationRequest(
    status: string,
    feedbacks: string,
    credential: any,
    guid: Guid
  ) {
    const update_verification_script = {
      name: 'update_verification',
      params: {
        status,
        feedbacks,
        credential,
        guid
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };

    await this.runTuumTechScript(update_verification_script);
  }

  public static async getVerificationRequests(did: string, my = true) {
    const get_verifications_script = {
      name: my ? 'get_requests_by_me' : 'get_requests_to_me',
      params: {
        did,
        limit: 200,
        skip: 0
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };

    let response: any = await this.runTuumTechScript(get_verifications_script);
    let items = getItemsFromData(
      response,
      my ? 'get_requests_by_me' : 'get_requests_to_me'
    );
    items = items.sort((a: any, b: any) => b.modified.$date - a.modified.$date);
    return items;
  }

  public static async getMyVerifiedCredentials(did: string, my = true) {
    const get_verifications_script = {
      name: 'get_my_verified_credentials',
      params: {
        did,
        limit: 200,
        skip: 0
      },
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID
      }
    };

    let response: any = await this.runTuumTechScript(get_verifications_script);
    let items = getItemsFromData(response, 'get_my_verified_credentials');
    items = items.sort((a: any, b: any) => b.modified.$date - a.modified.$date);
    return items;
  }
}

export class UserVaultScriptService {
  private static async generateUserToken(mnemonics: string, address: string) {
    let isEssentialUser = mnemonics === undefined || mnemonics === '';
    let challenge = await HiveService.getHiveChallenge(
      address,
      isEssentialUser
    );
    let didService = await DidService.getInstance();
    let presentation;
    if (mnemonics) {
      presentation = await didService.generateVerifiablePresentationFromUserMnemonics(
        mnemonics,
        '',
        challenge.issuer,
        challenge.nonce
      );
    } else {
      presentation = await didService.generateVerifiablePresentationFromEssentialCred(
        challenge.issuer,
        challenge.nonce
      );
    }
    const userToken = await HiveService.getUserHiveToken(
      address,
      presentation,
      isEssentialUser
    );
    return userToken;
  }

  public static async register(user: ISessionItem): Promise<ISessionItem> {
    //if (!user) return;

    let newUser = user;
    let response = await TuumTechScriptService.searchUserWithDIDs([
      newUser.did
    ]);
    let items = [];
    if (
      response.data &&
      response.data.get_user_by_did &&
      response.data.get_user_by_did.items &&
      response.data.get_user_by_did.items.length > 0
    ) {
      items = response.data.get_user_by_did.items[0];
    } else if (response.length > 0) {
      items = response;
    }

    if (items.length > 0) {
      const userInfo = items[0];
      if (
        !userInfo.tutorialStep ||
        userInfo.tutorialStep !== 4 ||
        !userInfo.onBoardingCompleted
      ) {
        // Backup mnemonic from locked user info
        userInfo.mnemonics = newUser.mnemonics;
        return userInfo;
      }

      try {
        let userToken = await this.generateUserToken(
          newUser.mnemonics,
          newUser.hiveHost
        );
        newUser.userToken = userToken;

        let userService = new UserService(await DidService.getInstance());
        await userService.updateSession(newUser);
        await TuumTechScriptService.updateTuumUser(newUser);
        let hiveInstance = await HiveService.getSessionInstance(newUser);
        await UserVaultScripts.Execute(hiveInstance!);
      } catch (error) {
        console.log('Could not register: ' + error);
      }
    }
    return newUser;
  }
}
