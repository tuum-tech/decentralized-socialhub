import { Guid } from 'guid-typescript';
import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { ActivityResponse } from 'src/pages/ActivityPage/types';
import { VerificationService } from 'src/services/verification.service';

import { showNotify } from 'src/utils/notify';
import { getItemsFromData } from 'src/utils/script';

import { DidDocumentService } from './diddocument.service';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { SearchService } from './search.service';

export class ProfileService {
  static didDocument: any = null;

  static getVerifiers = async (
    x: any,
    type: string,
    userSession: ISessionItem
  ) => {
    if (userSession.did === '') {
      return [];
    }
    if (ProfileService.didDocument === null) {
      ProfileService.didDocument = await ProfileService.getDidDocument(
        userSession
      );
    }

    const vService = new VerificationService();
    return await vService.getCredentialVerifiers(
      x,
      type,
      ProfileService.didDocument
    );
  };

  static getDidDocument = async (
    userSession: ISessionItem
  ): Promise<DIDDocument> => {
    let document = await DidDocumentService.getUserDocument(userSession);
    return document;
  };

  static async getPublicFields(did: string): Promise<string[]> {
    let fields: string[] = [];
    let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let userResponse = await searchServiceLocal.getUsersByDIDs([did], 1, 0);
    if (
      !userResponse.isSuccess ||
      !userResponse.response ||
      !userResponse.response.get_users_by_tutorialStep ||
      userResponse.response.get_users_by_tutorialStep.items.length === 0
    )
      return fields;

    const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
      userResponse.response.get_users_by_tutorialStep.items[0].hiveHost
    );

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

  static async updatePublicFields(fields: string[], userSession: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(userSession);
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

  static async getFullProfile(
    did: string,
    userSession: ISessionItem
  ): Promise<ProfileDTO> {
    let basicDTO: any = {};
    let educationDTO: EducationDTO = {
      items: [],
      isEnabled: true
    };
    let experienceDTO: ExperienceDTO = {
      items: [],
      isEnabled: true
    };

    let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let userResponse = await searchServiceLocal.getUsersByDIDs([did], 1, 0);
    if (
      userResponse.isSuccess &&
      userResponse.response &&
      userResponse.response.get_users_by_tutorialStep &&
      userResponse.response.get_users_by_tutorialStep.items.length > 0
    ) {
      const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
        userResponse.response.get_users_by_tutorialStep.items[0].hiveHost
      );

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
          educationDTO.items[i].verifiers = await ProfileService.getVerifiers(
            x,
            'education',
            userSession
          );
        });
        /* Calculate verified education credentials ends */

        /* Calculate verified experience credentials starts */
        experienceDTO.items.map(async (x, i) => {
          experienceDTO.items[i].verifiers = await ProfileService.getVerifiers(
            x,
            'experience',
            userSession
          );
        });
        /* Calculate verified experience credentials ends */
      }
    }

    // add name credentials
    const nameCredential = {
      name: basicDTO.name,
      verifiers: await ProfileService.getVerifiers({}, 'name', userSession)
    };

    return {
      name: nameCredential,
      basicDTO,
      educationDTO,
      experienceDTO
    };
  }

  static async updateAbout(basicDTO: BasicDTO, session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_basic_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: basicDTO
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('About info is successfuly saved', 'success');
      }
    }
  }

  static async updateExperienceProfile(
    experienceItem: ExperienceItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_experience_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: experienceItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Experience info is successfuly saved', 'success');
      }
    }
  }

  static async updateEducationProfile(
    educationItem: EducationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_education_profile',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Education info is successfuly saved', 'success');
      }
    }
  }

  static async removeEducationItem(
    educationItem: EducationItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_education_item',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: educationItem
      });
      if (res.isSuccess && res.response._status === 'OK') {
        showNotify('Education info is successfuly removed', 'success');
      }
    }
  }

  static async removeExperienceItem(
    experienceItem: ExperienceItem,
    session: ISessionItem
  ) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_experience_item',
        context: {
          target_did: session.did,
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

  static async unfollow(did: string, session: ISessionItem): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance(session);
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

      const sDid = session ? session.did : '';
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

      if (session) {
        return this.getFollowings(session.did);
      }
    }

    return;
  }

  static async resetFollowing(session: ISessionItem): Promise<any> {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (!hiveInstance) return;
    await hiveInstance.Database.deleteCollection('following');
    await hiveInstance.Database.createCollection('following');
    return this.getFollowings(session.did);
  }

  static async getFollowings(
    targetDid: string
  ): Promise<IFollowingResponse | undefined> {
    let response: IFollowingResponse = {
      get_following: { items: [] }
    };

    if (targetDid && targetDid !== '') {
      let searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let userResponse = await searchServiceLocal.getUsersByDIDs(
        [targetDid],
        1,
        0
      );
      if (
        !userResponse.isSuccess ||
        !userResponse.response ||
        !userResponse.response.get_users_by_tutorialStep ||
        userResponse.response.get_users_by_tutorialStep.items.length === 0
      )
        return response;

      const hiveInstance = await HiveService.getReadOnlyUserHiveClient(
        userResponse.response.get_users_by_tutorialStep.items[0].hiveHost
      );

      if (hiveInstance) {
        const followingResponse: IRunScriptResponse<IFollowingResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_following',
            context: {
              target_did: targetDid,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );

        if (followingResponse.isSuccess) {
          return followingResponse.response;
        }
      }
    }
    return response;
  }

  static async addFollowing(did: string, session: ISessionItem): Promise<any> {
    const hiveClient = await HiveService.getSessionInstance(session);
    if (hiveClient && did && did !== '') {
      await hiveClient.Database.insertOne('following', { did: did }, undefined);

      let followersResponse = await this.getFollowers([did]);

      let followersList: string[] = [];
      if (followersResponse && followersResponse.get_followers.items.length > 0)
        // TODO: handle this better
        followersList = followersResponse.get_followers.items[0].followers;

      const sDid = session ? session.did : '';
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

      let userService = new UserService(await DidService.getInstance());
      let followingUser = await userService.SearchUserWithDID(did);

      await this.addActivity(
        {
          guid: '',
          did: sDid,
          message:
            '<a href="/did/' +
            sDid.replaceAll('did:elastos:', '') +
            '" target="_blank">' +
            session!.name +
            '</a> Followed you',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        session
      );

      await this.addActivity(
        {
          guid: '',
          did: sDid,
          message:
            'You are following <a href="/did/' +
            did.replaceAll('did:elastos:', '') +
            '" target="_blank">' +
            followingUser.name +
            '</a>',
          read: false,
          createdAt: 0,
          updatedAt: 0
        },
        session
      );

      if (session) {
        return this.getFollowings(session.did);
      }
    }
    return;
  }
  static async getActivity(session: ISessionItem) {
    const hiveInstance = await HiveService.getSessionInstance(session);

    if (session && hiveInstance) {
      const result: IRunScriptResponse<ActivityResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_activity',
          context: {
            target_did: session.did,
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
        `temporary_activities_${session!.did.replace('did:elastos:', '')}`
      ) || '[]'
    );
    return tmp_activities;
  }
  static async addActivity(activity: ActivityItem, session: ISessionItem) {
    // Assign new guid to activity
    if (!activity.guid) activity.guid = Guid.create();
    if (!activity.createdAt) activity.createdAt = new Date().getTime();
    if (!activity.updatedAt) activity.updatedAt = new Date().getTime();
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'add_activity',
        context: {
          target_did: session.did,
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

  static async updateActivity(activity: ActivityItem, session: ISessionItem) {
    activity.updatedAt = new Date().getTime();
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_activity',
        context: {
          target_did: session.did,
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
  tutorialStep: 1,
  timestamp: Date.now()
};

export const defaultFullProfile = {
  name: {
    name: '',
    verifiers: []
  },
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
