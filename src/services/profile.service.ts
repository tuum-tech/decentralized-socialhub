import { HiveClient } from '@elastos/elastos-hive-js-sdk';
import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { Session } from 'inspector';
// import { floor, noConflict } from 'lodash';
import { ProfileResponse } from 'src/pages/ProfilePage/types';
import {
  BasicDTO,
  EducationDTO,
  EducationItem,
  ExperienceItem,
} from 'src/pages/PublicPage/types';
import { HiveService } from './hive.service';
import { ScriptService } from './script.service';
import { ISessionItem, UserService } from './user.service';

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
  hiveClient!: HiveClient;
  appHiveClient!: HiveClient;

  static async getProfileServiceUserOnlyInstance(): Promise<ProfileService> {
    let profileService: ProfileService = new ProfileService();
    let hiveClient = await HiveService.getSessionInstance();

    if (hiveClient) profileService.hiveClient = hiveClient;
    // profileService.appHiveClient = await HiveService.getAppHiveClient();
    return profileService;
  }

  static async getProfileServiceInstance(): Promise<ProfileService> {
    let profileService: ProfileService = new ProfileService();
    //let hiveClient = await HiveService.getSessionInstance();

    //if (hiveClient) profileService.hiveClient = hiveClient;
    profileService.appHiveClient = await HiveService.getAppHiveClient();
    return profileService;
  }

  static async getProfileServiceAppOnlyInstance(): Promise<ProfileService> {
    let profileService: ProfileService = new ProfileService();
    profileService.appHiveClient = await HiveService.getAppHiveClient();
    return profileService;
  }

  // async getMyFollowings(): Promise<IRunScriptResponse<IFollowingResponse>> {
  //   return this.hiveClient.Scripting.RunScript({ name: 'get_following' });
  // }

  async getUserFollowings(
    did: string
  ): Promise<IRunScriptResponse<IFollowingResponse>> {
    return await this.hiveClient.Scripting.RunScript({
      name: 'get_following',
      context: {
        target_did: did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`,
      },
    });
  }

  async getFullProfile(
    did: string
  ): Promise<IRunScriptResponse<ProfileResponse>> {
    return this.appHiveClient.Scripting.RunScript({
      name: 'get_full_profile',
      context: {
        target_did: did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`,
      },
    });
  }

  async updateBasicProfile(basicDTO: ISessionItem): Promise<any> {
    const update_user_script = {
      name: 'update_user',
      params: basicDTO,
      context: {
        target_did: process.env.REACT_APP_APPLICATION_DID,
        target_app_did: process.env.REACT_APP_APPLICATION_ID,
      },
    };
    let response: any = await ScriptService.runTuumTechScript(
      update_user_script
    );
    const { data, meta } = response;
    if (meta.code === 200 && meta.message === 'OK') {
    }
  }

  async updateAbout(basicDTO: BasicDTO): Promise<any> {
    debugger;
    const update_user_script = {
      name: 'update_basic_profile',
      params: basicDTO,
      context: {
        target_did: UserService.GetUserSession().did,
        target_app_did: process.env.REACT_APP_APPLICATION_ID,
      },
    };
    let response: any = await ScriptService.runTuumTechScript(
      update_user_script
    );
    const { data, meta } = response;
    if (meta.code === 200 && meta.message === 'OK') {
    }
  }

  async updateEducationProfile(
    educationItem: EducationItem
  ): Promise<IRunScriptResponse<ProfileResponse>> {
    return this.appHiveClient.Scripting.RunScript({
      name: 'update_education_profile',
      context: {
        target_did: UserService.GetUserSession().did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`,
      },
      params: educationItem,
    });
  }

  async removeEducationItem(
    educationItem: EducationItem
  ): Promise<IRunScriptResponse<ProfileResponse>> {
    return this.appHiveClient.Scripting.RunScript({
      name: 'remove_education_item',
      context: {
        target_did: UserService.GetUserSession().did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`,
      },
      params: educationItem,
    });
  }

  async updateExperienceProfile(
    experienceItem: ExperienceItem
  ): Promise<IRunScriptResponse<ProfileResponse>> {
    return this.appHiveClient.Scripting.RunScript({
      name: 'update_experience_profile',
      context: {
        target_did: UserService.GetUserSession().did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`,
      },
      params: experienceItem,
    });
  }

  async getFollowings(did: string): Promise<IFollowingResponse> {
    let followings: IFollowingResponse;

    followings = (await this.getUserFollowings(did))
      .response as IFollowingResponse;

    console.log('followings :' + JSON.stringify(followings));
    return followings;
  }

  async resetFollowing(): Promise<any> {
    if (!this.hiveClient) return;
    await this.hiveClient.Database.deleteCollection('following');
    await this.hiveClient.Database.createCollection('following');
    return this.getFollowings(UserService.GetUserSession().did);
  }

  getSessionDid(): string {
    return UserService.GetUserSession().did;
  }

  async getFollowers(dids: string[]): Promise<IFollowerResponse | undefined> {
    console.log(JSON.stringify(dids));

    const profileAppHiveClient: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();

    let followersResponse: IRunScriptResponse<IFollowerResponse> = await profileAppHiveClient.appHiveClient.Scripting.RunScript(
      {
        name: 'get_followers',
        params: {
          did: dids,
        },
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`,
        },
      }
    );

    if (followersResponse.isSuccess) {
      return followersResponse.response;
    }
    return;
  }

  // async getFollowersCount(did: string): Promise<string> {
  //     let followersResponse: IFollowerResponse = await this.getFollowers(did);
  //     //if (followersResponse.get_followers[0].followerslength > 0)

  //     console.log("count :" + followersResponse.get_followers.items[0].followers.length.toString());
  //     return followersResponse.get_followers.items[0].followers.length.toString();
  //     //return 0
  // }

  async unfollow(did: string): Promise<any> {
    if (!this.hiveClient) return;
    console.log('unfollow: ' + did);

    let deleteResponse = await this.hiveClient.Database.deleteOne('following', {
      did: did,
    });
    console.log(JSON.stringify(deleteResponse));

    let followersResponse = await this.getFollowers([did]);
    let followersList: string[] = [];
    if (followersResponse && followersResponse.get_followers.items.length > 0)
      // TODO: handle this better
      followersList = followersResponse.get_followers.items[0].followers;

    followersList = followersList.filter((item) => item !== did);

    let uniqueItems = [...new Set(followersList)]; // distinct

    if (!this.appHiveClient) {
      let profileServiceLocal: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
      await profileServiceLocal.appHiveClient.Scripting.RunScript({
        name: 'set_followers',
        params: {
          did: did,
          followers: uniqueItems,
        },
      });
    } else {
      await this.appHiveClient.Scripting.RunScript({
        name: 'set_followers',
        params: {
          did: did,
          followers: uniqueItems,
        },
      });
    }

    return this.getFollowings(UserService.GetUserSession().did);
  }

  async addFollowing(did: string): Promise<any> {
    if (!this.hiveClient) return;
    await this.hiveClient.Database.insertOne(
      'following',
      { did: did },
      undefined
    );

    let followersResponse = await this.getFollowers([did]);

    let followersList: string[] = [];
    if (followersResponse && followersResponse.get_followers.items.length > 0)
      // TODO: handle this better
      followersList = followersResponse.get_followers.items[0].followers;

    followersList.push(this.getSessionDid());

    let uniqueItems = [...new Set(followersList)]; // distinct

    if (!this.appHiveClient) {
      let profileServiceLocal: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
      await profileServiceLocal.appHiveClient.Scripting.RunScript({
        name: 'set_followers',
        params: {
          did: did,
          followers: uniqueItems,
        },
      });
    } else {
      await this.appHiveClient.Scripting.RunScript({
        name: 'set_followers',
        params: {
          did: did,
          followers: uniqueItems,
        },
      });
    }

    return this.getFollowings(UserService.GetUserSession().did);
  }
}
