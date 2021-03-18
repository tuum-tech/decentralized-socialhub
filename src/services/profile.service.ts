import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { ProfileResponse } from 'src/pages/ProfilePage/types';
import {
  EducationItem,
  ExperienceItem,
  BasicDTO
} from 'src/pages/PublicPage/types';
import { HiveService } from './hive.service';
import { UserService } from './user.service';

export interface IFollowingResponse {
  _status?: string;
  get_following: IGetFollowing;
}

export interface IGetFollowing {
  items: IFollowingItem[];
}

export interface IFollowingItem {
  _id?: { $oid: string };
  created?: { $date: string };
  did: string;
  modified?: { $date: string };
  followers?: string;
}

export interface IFollowerResponse {
  _status?: string;
  get_followers: IGetFollowersBody;
}

export interface IGetFollowersBody {
  items: IFollowerItem[];
}

export interface IFollowerItem {
  did: string;
  name: string;
  followers: string[];
}

export class ProfileService {
  static async getFullProfile(
    did: string
  ): Promise<IRunScriptResponse<ProfileResponse>> {
    const hiveInstance = await HiveService.getSessionInstance();
    return hiveInstance!.Scripting.RunScript({
      name: 'get_full_profile',
      context: {
        target_did: did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      }
    });
  }

  static async updateEducationProfile(
    educationItem: EducationItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      return hiveInstance.Scripting.RunScript({
        name: 'update_education_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
    }
  }

  static async removeEducationItem(
    educationItem: EducationItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      return hiveInstance.Scripting.RunScript({
        name: 'remove_education_item',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
    }
  }

  static async updateAbout(basicDTO: BasicDTO) {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      return hiveInstance.Scripting.RunScript({
        name: 'update_basic_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: basicDTO
      });
    }
  }

  static async updateExperienceProfile(
    experienceItem: ExperienceItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      return hiveInstance.Scripting.RunScript({
        name: 'update_experience_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
    }
  }

  static async removeExperienceItem(
    experienceItem: ExperienceItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    const hiveInstance = await HiveService.getSessionInstance();
    if (userSession && hiveInstance) {
      return hiveInstance.Scripting.RunScript({
        name: 'remove_experience_item',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
    }
  }

  static async getUserFollowings(
    did: string
  ): Promise<IRunScriptResponse<IFollowingResponse> | undefined> {
    const hiveInstance = await HiveService.getSessionInstance();
    if (hiveInstance) {
      return hiveInstance.Scripting.RunScript({
        name: 'get_following',
        context: {
          target_did: did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        }
      });
    }
  }

  static async getFollowings(did: string): Promise<IFollowingResponse> {
    const getUserFollowingScriptRes: any = await this.getUserFollowings(did);
    return getUserFollowingScriptRes!.response as IFollowingResponse;
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

  static async getFollowers(
    dids: string[]
  ): Promise<IFollowerResponse | undefined> {
    const appHiveClient = await HiveService.getAppHiveClient();
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
    return;
  }

  static async unfollow(did: string): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance();
    if (!hiveInstance) return;

    await hiveInstance.Database.deleteOne('following', {
      did: did
    });

    let followersResponse = await this.getFollowers([did]);
    let followersList: string[] = [];
    if (followersResponse && followersResponse.get_followers.items.length > 0) {
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

  static async addFollowing(did: string): Promise<any> {
    const hiveClient = await HiveService.getSessionInstance();
    if (!hiveClient) return;
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

    if (userSession) {
      return this.getFollowings(userSession.did);
    }
  }
}
