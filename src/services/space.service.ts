import _ from 'lodash';
import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { getItemsFromData } from 'src/utils/script';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { showNotify } from 'src/utils/notify';

export enum SpaceCategory {
  Personal = 'Personal Group',
  NFT = 'NFT Collection',
  Org = 'Organization',
  Univ = 'University'
}

export const defaultSpace: Space = {
  name: '',
  description: '',
  category: 'personal',
  avatar: '',
  coverPhoto: '',
  publicFields: []
};
export class SpaceService {
  static async getAllSpaces(session?: ISessionItem) {
    if (!session) {
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        const response = await appHiveClient.Scripting.RunScript({
          name: 'get_all_spaces',
          context: {
            target_did: process.env.REACT_APP_APPLICATION_DID,
            target_app_did: process.env.REACT_APP_APPLICATION_ID
          }
        });
        let items = getItemsFromData(response, 'get_all_spaces');

        let didService = await DidService.getInstance();
        let userService = new UserService(didService);
        const groups = _.groupBy(items, 'owner');
        let spaces = await Promise.all(
          Object.keys(groups).map(async (did: any) => {
            const tuumUser = await userService.SearchUserWithDID(did);
            const spaceNames = groups[did].map((x: any) => x.name);
            const spaces = await this.getSpaceByNames(tuumUser, spaceNames);
            return spaces.map((x: any) => ({ ...x, owner: did }));
          })
        );
        spaces = spaces.reduce((total, x) => total.concat(x), []);
        return spaces;
      }
    } else {
      const hiveInstance = await HiveService.getSessionInstance(session);

      if (session && hiveInstance) {
        const result: IRunScriptResponse<SpacesResponse> = await hiveInstance.Scripting.RunScript(
          {
            name: 'get_all_spaces',
            context: {
              target_did: session.did,
              target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
            }
          }
        );
        const spaces = getItemsFromData(result, 'get_all_spaces');
        return spaces;
      }
    }

    return [];
  }
  static async getSpaceByNames(session: ISessionItem, names: string[]) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const result: IRunScriptResponse<SpacesResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_space_by_names',
          params: { names },
          context: {
            target_did: session.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const data = getItemsFromData(result, 'get_space_by_names');
      return data;
    }
    return [];
  }
  static async addSpace(session: ISessionItem, space: Space) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'add_space',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: space
      });
      if (res.isSuccess && res.response._status === 'OK') {
        const appHiveClient = await HiveService.getAppHiveClient();
        if (appHiveClient) {
          await appHiveClient.Scripting.RunScript({
            name: 'add_space',
            params: { name: space.name, did: session.did },
            context: {
              target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          });
          showNotify('New space details has been successfuly saved', 'success');
        }
      }
    }
  }
  static async removeSpace(session: ISessionItem, space: Space) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'remove_space',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: space
      });
      if (res.isSuccess && res.response._status === 'OK') {
        const appHiveClient = await HiveService.getAppHiveClient();
        if (appHiveClient) {
          await appHiveClient.Scripting.RunScript({
            name: 'remove_space',
            params: { name: space.name, did: session.did },
            context: {
              target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          });
          showNotify('Space has been successfuly removed', 'success');
        }
      }
    }
  }
  static async getCommunitySpaces() {
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      const response = await appHiveClient.Scripting.RunScript({
        name: 'get_community_spaces',
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID
        }
      });
      let items = getItemsFromData(response, 'get_community_spaces');
      return items;
    }
    return [];
  }
}
