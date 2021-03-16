import { HiveClient } from '@elastos/elastos-hive-js-sdk';
import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { ProfileResponse } from 'src/pages/ProfilePage/types';
import {
  BasicDTO,
  EducationItem,
  ExperienceItem
} from 'src/pages/PublicPage/types';
import { HiveService } from './hive.service';
import { TuumTechScriptService } from './script.service';
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
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      }
    });
  }

  async getFullProfile(
    did: string
  ): Promise<IRunScriptResponse<ProfileResponse>> {
    return this.appHiveClient.Scripting.RunScript({
      name: 'get_full_profile',
      context: {
        target_did: did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      }
    });
  }

  async updateBasicProfile(basicDTO: ISessionItem): Promise<any> {
    await TuumTechScriptService.updateBasicProfile(basicDTO);
  }

  async updateAbout(basicDTO: BasicDTO): Promise<any> {
    await TuumTechScriptService.updateAbout(basicDTO);
  }

  async updateEducationProfile(
    educationItem: EducationItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.appHiveClient.Scripting.RunScript({
        name: 'update_education_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
    }
  }

  async removeEducationItem(
    educationItem: EducationItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.appHiveClient.Scripting.RunScript({
        name: 'remove_education_item',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
    }
  }

  async updateExperienceProfile(
    experienceItem: ExperienceItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.appHiveClient.Scripting.RunScript({
        name: 'update_experience_profile',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
    }
  }

  async removeExperienceItem(
    experienceItem: ExperienceItem
  ): Promise<IRunScriptResponse<ProfileResponse> | undefined> {
    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.appHiveClient.Scripting.RunScript({
        name: 'remove_experience_item',
        context: {
          target_did: userSession.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
    }
  }

  async getFollowings(did: string): Promise<IFollowingResponse> {
    let followings: IFollowingResponse;

    followings = (await this.getUserFollowings(did))
      .response as IFollowingResponse;

    return followings;
  }

  async resetFollowing(): Promise<any> {
    if (!this.hiveClient) return;
    await this.hiveClient.Database.deleteCollection('following');
    await this.hiveClient.Database.createCollection('following');
    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.getFollowings(userSession.did);
    }
  }

  getSessionDid(): string {
    const userSession = UserService.GetUserSession();
    return userSession ? userSession.did : '';
  }

  async getFollowers(dids: string[]): Promise<IFollowerResponse | undefined> {
    const profileAppHiveClient: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();

    let followersResponse: IRunScriptResponse<IFollowerResponse> = await profileAppHiveClient.appHiveClient.Scripting.RunScript(
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

  async unfollow(did: string): Promise<any> {
    if (!this.hiveClient) return;

    let deleteResponse = await this.hiveClient.Database.deleteOne('following', {
      did: did
    });

    let followersResponse = await this.getFollowers([did]);
    let followersList: string[] = [];
    if (followersResponse && followersResponse.get_followers.items.length > 0)
      // TODO: handle this better
      followersList = followersResponse.get_followers.items[0].followers;

    const sDid = this.getSessionDid();
    if (sDid !== '') {
      followersList = followersList.filter(item => item !== sDid);
    }

    let uniqueItems = [...new Set(followersList)]; // distinct

    if (!this.appHiveClient) {
      let profileServiceLocal: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
      await profileServiceLocal.appHiveClient.Scripting.RunScript({
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
    } else {
      await this.appHiveClient.Scripting.RunScript({
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

    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.getFollowings(userSession.did);
    }
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

    const sDid = this.getSessionDid();
    if (sDid !== '') {
      followersList.push(sDid);
    }

    let uniqueItems = [...new Set(followersList)]; // distinct

    if (!this.appHiveClient) {
      let profileServiceLocal: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
      await profileServiceLocal.appHiveClient.Scripting.RunScript({
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
    } else {
      await this.appHiveClient.Scripting.RunScript({
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

    const userSession = UserService.GetUserSession();
    if (userSession) {
      return this.getFollowings(userSession.did);
    }
  }
}
