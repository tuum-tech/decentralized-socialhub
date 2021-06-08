import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { ActivityResponse } from 'src/pages/ActivityPage/types';
import { getVerifiedCredential } from 'src/utils/credential';

import { showNotify } from 'src/utils/notify';
import { getItemsFromData } from 'src/utils/script';
import { DidDocumentService } from './diddocument.service';

import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { Guid } from 'guid-typescript';

export class ProfileService {
  static didDocument: any = null;

  static isCredVerified = async (key: string, profileValue: string) => {
    if (ProfileService.didDocument === null) {
      ProfileService.didDocument = await ProfileService.getDidDocument();
    }

    let vc = getVerifiedCredential(key, ProfileService.didDocument);
    if (!vc) return false;

    return vc.value === profileValue && vc.isVerified;
  };

  static getDidDocument = async () => {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      return;
    }
    let documentState = await DidDocumentService.getUserDocument(userSession);
    return documentState.diddocument;
  };

  static async getPublicFields(did: string): Promise<string[]> {
    const hiveInstance = await HiveService.getAppHiveClient();
    let fields: string[] = [];
    if (hiveInstance) {
      const res: IRunScriptResponse<PublicProfileResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_public_fields',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );

      fields =
        (getItemsFromData(res, 'get_public_fields')[0] || {}).fields || [];
    }
    return fields;
  }

  static async updatePublicFields(fields: string[]) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'set_public_fields',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: { fields, did: userSession.did }
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Public profile fields are successfuly saved', 'success');
      }
    }
  }

  static async getFullProfile(did: string): Promise<ProfileDTO | undefined> {
    let basicDTO: any = {};
    let educationDTO: EducationDTO = {
      items: [],
      isEnabled: true
    };
    let experienceDTO: ExperienceDTO = {
      items: [],
      isEnabled: true
    };
    const hiveInstance = await HiveService.getAppHiveClient();
    if (hiveInstance) {
      const bpRes: IRunScriptResponse<BasicProfileResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_basic_profile',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const gbPData = getItemsFromData(bpRes, 'get_basic_profile');
      if (gbPData.length > 0) {
        basicDTO = gbPData[0];
      }

      const edRes: IRunScriptResponse<EducationProfileResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_education_profile',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      educationDTO.items = getItemsFromData(edRes, 'get_education_profile');

      const epRes: IRunScriptResponse<ExperienceProfileResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_experience_profile',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      experienceDTO.items = getItemsFromData(epRes, 'get_experience_profile');

      /* Calculate verified education credentials starts */
      educationDTO.items.map(async (x, i) => {
        educationDTO.items[i].isVerified = await ProfileService.isCredVerified(
          'education',
          x.institution
        );
      });
      /* Calculate verified education credentials ends */

      /* Calculate verified experience credentials starts */
      experienceDTO.items.map(async (x, i) => {
        experienceDTO.items[i].isVerified = await ProfileService.isCredVerified(
          'occupation',
          x.title
        );
      });
      /* Calculate verified experience credentials ends */
    }
    return {
      basicDTO,
      educationDTO,
      experienceDTO
    };
  }

  static async updateAbout(basicDTO: BasicDTO) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_basic_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: basicDTO
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('About info is successfuly saved', 'success');
      }
    }
  }

  static async updateExperienceProfile(experienceItem: ExperienceItem) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_experience_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Experience info is successfuly saved', 'success');
      }
    }
  }

  static async updateEducationProfile(educationItem: EducationItem) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_education_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Education info is successfuly saved', 'success');
      }
    }
  }

  static async removeEducationItem(educationItem: EducationItem) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_education_item',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Education info is successfuly removed', 'success');
      }
    }
  }

  static async removeExperienceItem(experienceItem: ExperienceItem) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_experience_item',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Experience info is successfuly removed', 'success');
      }
    }
  }

  static async getFollowers(
    dids: string[]
  ): Promise<IFollowerResponse | undefined> {
    let userSession = UserService.GetUserSession();
    if (!userSession || userSession.tutorialStep !== 4) {
      return;
    }

    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient && dids && dids.length > 0) {
      let followersResponse: IRunScriptResponse<IFollowerResponse> = await appHiveClient.Scripting.RunScript(
        {
          name: 'get_followers',
          params: {
            did: dids
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        }
      );
      if (followersResponse.isSuccess) {
        return followersResponse.response;
      }
    }
    return;
  }

  static async unfollow(did: string): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance();
    if (hiveInstance && did && did !== '') {
      await hiveInstance.Database.deleteOne('following', {
        did: did
      });

      let followersResponse = await this.getFollowers([did]);
      let followersList: string[] = [];
      if (
        followersResponse &&
        followersResponse.get_followers.items.length > 0
      ) {
        // TODO: handle this better
        followersList = followersResponse.get_followers.items[0].followers;
      }

      const userSession = UserService.GetUserSession();
      const sDid = userSession ? userSession.did : '';
      if (sDid !== '') {
        followersList = followersList.filter(item => item !== sDid);
      }
      let uniqueItems = [...new Set(followersList)]; // distinct

      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'set_followers',
          params: {
            did: did,
            followers: uniqueItems
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
      }

      if (userSession) {
        return this.getFollowings(userSession.did);
      }
    }

    return;
  }

  static async resetFollowing(): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance();
    if (!hiveInstance) return;
    await hiveInstance.Database.deleteCollection('following');
    await hiveInstance.Database.createCollection('following');
    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.getFollowings(userSession.did);
    }
  }

  static async getFollowings(
    did: string
  ): Promise<IFollowingResponse | undefined> {
    let userSession = UserService.GetUserSession();
    if (!userSession || userSession.tutorialStep !== 4) {
      return;
    }

    const appHiveClient = await HiveService.getAppHiveClient();
    if (did && did !== '' && appHiveClient) {
      const followingResponse: IRunScriptResponse<IFollowingResponse> = await appHiveClient.Scripting.RunScript(
        {
          name: 'get_following',
          context: {
            target_did: did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );

      if (followingResponse.isSuccess) {
        return followingResponse.response;
      }
    }
    return;
  }

  static async addFollowing(did: string): Promise<any> {
    const hiveClient = await HiveService.getSessionInstance();
    if (hiveClient && did && did !== '') {
      await hiveClient.Database.insertOne('following', { did: did }, undefined);

      let followersResponse = await this.getFollowers([did]);

      let followersList: string[] = [];
      if (followersResponse && followersResponse.get_followers.items.length > 0)
        // TODO: handle this better
        followersList = followersResponse.get_followers.items[0].followers;

      const userSession = UserService.GetUserSession();
      const sDid = userSession ? userSession.did : '';
      if (sDid !== '') {
        followersList.push(sDid);
      }

      let uniqueItems = [...new Set(followersList)]; // distinct

      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'set_followers',
          params: {
            did: did,
            followers: uniqueItems
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
      }

      let followingUser = await UserService.SearchUserWithDID(did);

      await this.addActivity(
        {
          guid: '',
          did: sDid,
          message:
            '<a href="/did/' +
            sDid +
            '" target="_blank">' +
            userSession!.name +
            '</a> Followed you',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        did
      );

      await this.addActivity(
        {
          guid: '',
          did: sDid,
          message:
            'You are following <a href="/did/' +
            did +
            '" target="_blank">' +
            followingUser.name +
            '</a>',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        sDid
      );

      if (userSession) {
        return this.getFollowings(userSession.did);
      }
    }
    return;
  }

  static async getActivity() {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();

    if (userSession && hiveInstance) {
      const result: IRunScriptResponse<ActivityResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_activity',
          context: {
            target_did: userSession.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const get_activity_items = getItemsFromData(result, 'get_activity');
      if (get_activity_items.length > 0) {
        return get_activity_items;
      }
    }
    let tmp_activities = JSON.parse(
      window.localStorage.getItem(
        `temporary_activities_${userSession!.did.replace('did:elastos:', '')}`
      ) || '[]'
    );
    return tmp_activities;
  }

  static async addActivity(activity: ActivityItem, activityOwner: string) {
    // Assign new guid to activity
    if (!activity.guid) activity.guid = Guid.create();
    if (!activity.createdAt) activity.createdAt = new Date().getTime();
    if (!activity.updatedAt) activity.updatedAt = new Date().getTime();
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'add_activity',
        context: {
          target_did: activityOwner,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: activity
      });
      if (res.isSuccess && res.response._status === 'OK') {
        // showNotify('Activity created', 'success');
      }
    } else {
      let tmp_activities = JSON.parse(
        window.localStorage.getItem(
          `temporary_activities_${activity.did.replace('did:elastos:', '')}`
        ) || '[]'
      );
      tmp_activities.push(activity);
      window.localStorage.setItem(
        `temporary_activities_${activity.did.replace('did:elastos:', '')}`,
        JSON.stringify(tmp_activities)
      );
    }
  }

  static async updateActivity(activity: ActivityItem) {
    activity.updatedAt = new Date().getTime();
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_activity',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: activity
      });
      if (res.isSuccess && res.response._status === 'OK') {
        // showNotify('Activity read by you', 'success');
      }
    } else {
      let tmp_activities = JSON.parse(
        window.localStorage.getItem(
          `temporary_activities_${activity.did.replace('did:elastos:', '')}`
        ) || '[]'
      );
      let index = tmp_activities.findIndex(
        (_activity: any) => _activity.guid.value === activity.guid.value
      );
      if (index < 0) return;
      tmp_activities[index] = activity;
      window.localStorage.setItem(
        `temporary_activities_${activity.did.replace('did:elastos:', '')}`,
        JSON.stringify(tmp_activities)
      );
    }
  }
}

export const defaultUserInfo: ISessionItem = {
  hiveHost: '',
  userToken: '',
  accountType: 'DID',
  did: '',
  email: '',
  name: '',
  isDIDPublished: false,
  didPublishTime: 0,
  loginCred: {
    email: ''
  },
  mnemonics: '',
  passhash: '',
  onBoardingCompleted: false,
  tutorialStep: 1
};

export const defaultFullProfile = {
  basicDTO: {
    isEnabled: false,
    name: '',
    hiveHost: '',
    email: '',
    did: '',
    title: '',
    about: '',
    address: {
      number: '',
      street_name: '',
      postal_code: '',
      state: '',
      country: ''
    }
  },
  educationDTO: {
    isEnabled: false,
    items: [] as EducationItem[]
  },
  experienceDTO: {
    isEnabled: false,
    items: [] as ExperienceItem[]
  }
};
