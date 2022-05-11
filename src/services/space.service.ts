import _ from 'lodash';
import { getItemsFromData } from 'src/utils/script';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { showNotify } from 'src/utils/notify';
import { Guid } from 'guid-typescript';
import { Logger } from 'src/shared-base/logger';

export enum SpaceCategory {
  Personal = 'Personal Group',
  NFT = 'NFT Collection',
  Org = 'Organization',
  Univ = 'University',
  WTP = 'Welcome to Profile'
}

export const defaultSpace: Space = {
  name: '',
  description: '',
  category: SpaceCategory.Personal,
  avatar: '',
  coverPhoto: '',
  publicFields: []
};
export class SpaceService {
  private static LOG = new Logger('SpaceService');

  static async getAllSpaces(session?: ISessionItem) {
    const c_spaces = await this.getCommunitySpaces(session);
    const p_spaces = await this.getPrivateSpaces(session);
    return p_spaces.concat(c_spaces);
  }

  static async getPrivateSpaces(session?: ISessionItem) {
    let spaces = [];
    let groups: any = {};
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (appHiveClient) {
      try {
        if (session) {
          const response = await appHiveClient.Scripting.callScript(
            'get_space_by_owner',
            { owner: session.did },
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          const items = getItemsFromData(response, 'get_space_by_owner');
          groups[session.did] = items;
        } else {
          const response = await appHiveClient.Scripting.callScript(
            'get_all_spaces',
            {},
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          const items = getItemsFromData(response, 'get_all_spaces');
          groups = _.groupBy(items, 'owner');
        }
        let didService = await DidService.getInstance();
        let userService = new UserService(didService);
        spaces = await Promise.all(
          Object.keys(groups).map(async (did: any) => {
            const guids = groups[did].map((x: any) => x.guid);
            const tuumUser = await userService.SearchUserWithDID(did);
            const _spaces = await this.getSpaceByIds(tuumUser, guids);
            return _spaces.map((x: any) => {
              const y = groups[did].find(
                (y: any) => y.guid.value === x.guid.value
              );
              return {
                ...x,
                ...y
              };
            });
          })
        );
      } catch (e) {
        SpaceService.LOG.error('getAllSpaces: {}', e);
      }
      spaces = spaces.reduce((total, x) => total.concat(x), []);
    }
    return spaces.map((space: any) => ({ ...space, isCommunitySpace: false }));
  }
  static async getCommunitySpaces(session?: ISessionItem) {
    let spaces = [];
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (appHiveClient) {
      const response = await appHiveClient.Scripting.callScript(
        'get_community_spaces',
        {},
        `${process.env.REACT_APP_APPLICATION_DID}`,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );
      spaces = getItemsFromData(response, 'get_community_spaces');
      spaces = spaces.filter((space: any) =>
        space.owner.includes(
          session && session.did ? session.did : space.owner[0]
        )
      );
    }
    return spaces.map((space: any) => ({ ...space, isCommunitySpace: true }));
  }
  static async getSpaceByNames(session: ISessionItem, names: string[]) {
    let spaces = [];
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const result: SpacesResponse = await hiveInstance.Scripting.callScript(
          'get_space_by_names',
          { names },
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        const items = getItemsFromData(result, 'get_space_by_names');
        const guids = items.map((x: any) => x.guid);
        const appHiveClient = await HiveService.getAnonymousHiveClient();
        if (appHiveClient) {
          const response = await appHiveClient.Scripting.callScript(
            'get_space_by_ids',
            { guids },
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          spaces = getItemsFromData(response, 'get_space_by_ids');
          return spaces.map((x: any) => {
            const y = items.find((y: any) => y.guid.value === x.guid.value);
            return {
              ...x,
              ...y
            };
          });
        }
      } catch (e) {
        SpaceService.LOG.error('getSpaceByNames: {}', e);
      }
    }
    return [];
  }

  static async getSpaceByIds(session: ISessionItem, guids: Guid[]) {
    try {
      const hiveInstance = await HiveService.getHiveClient(session);
      if (session && hiveInstance) {
        const result: SpacesResponse = await hiveInstance.Scripting.callScript(
          'get_space_by_ids',
          { guids },
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        const spaces = getItemsFromData(result, 'get_space_by_ids');
        return spaces.map((space: any) => ({
          ...space,
          isCommunitySpace: false
        }));
      }
      return [];
    } catch (e) {
      SpaceService.LOG.error('getSpaceByIds: {}', e);
    }
  }
  static async getCommunitySpaceByNames(names: string[]) {
    try {
      const appHiveClient = await HiveService.getApplicationHiveClient();
      if (appHiveClient) {
        const response = await appHiveClient.Scripting.callScript(
          'get_community_space_by_names',
          { names },
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        const spaces = getItemsFromData(
          response,
          'get_community_space_by_names'
        );
        return spaces.map((space: any) => ({
          ...space,
          isCommunitySpace: true
        }));
      }
      return [];
    } catch (e) {
      SpaceService.LOG.error('getCommunitySpaceByNames: {}', e);
    }
  }
  static async getCommunitySpaceByIds(guids: Guid[]) {
    try {
      const appHiveClient = await HiveService.getAnonymousHiveClient();
      if (appHiveClient) {
        const response = await appHiveClient.Scripting.callScript(
          'get_community_space_by_ids',
          { guids },
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        const spaces = getItemsFromData(response, 'get_community_space_by_ids');
        return spaces.map((space: any) => ({
          ...space,
          isCommunitySpace: true
        }));
      }
      return [];
    } catch (e) {
      SpaceService.LOG.error('getCommunitySpaceByIds: {}', e);
    }
  }
  static async addSpace(
    session: ISessionItem,
    space: Space,
    notify: boolean = true
  ) {
    try {
      if (space.category === SpaceCategory.Personal) {
        const hiveInstance = await HiveService.getHiveClient(session);
        if (session && hiveInstance) {
          const res: any = await hiveInstance.Scripting.callScript(
            'add_space',
            space,
            session.did,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          if (res.isSuccess && res.response._status === 'OK') {
            const appHiveClient = await HiveService.getAnonymousHiveClient();
            if (appHiveClient) {
              await appHiveClient.Scripting.callScript(
                'add_space',
                {
                  guid: (space as any).guid,
                  owner: session.did,
                  followers: [session.did]
                },
                `${process.env.REACT_APP_APPLICATION_DID}`,
                `${process.env.REACT_APP_APPLICATION_DID}`
              );
              if (notify)
                showNotify(
                  'Space details has been successfuly saved',
                  'success'
                );
            }
          }
        }
      } else {
        const appHiveClient = await HiveService.getAnonymousHiveClient();
        if (appHiveClient) {
          await appHiveClient.Scripting.callScript(
            'add_community_space',
            space,
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          if (notify)
            showNotify('Space details has been successfuly saved', 'success');
        }
      }
    } catch (e) {
      SpaceService.LOG.error('addSpace: {}', e);
    }
  }

  static async removeSpace(session: ISessionItem, space: Space) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      try {
        const res: any = await hiveInstance.Scripting.callScript(
          'remove_space',
          space,
          session.did,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        if (res) {
          await hiveInstance.Scripting.callScript(
            'remove_space',
            { name: space.name, owner: session.did },
            `${process.env.REACT_APP_APPLICATION_DID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
        }
        showNotify('Space has been successfuly removed', 'success');
      } catch (e) {
        SpaceService.LOG.error('removeSpace: {}', e);
      }
    }
  }
  static async follow(session: ISessionItem, space: Space) {
    const followers = [...(space.followers || []), session.did];
    const appHiveClient = await HiveService.getAnonymousHiveClient();
    if (appHiveClient) {
      const scriptName =
        space.category === SpaceCategory.Personal
          ? 'follow_space'
          : 'follow_community_space';
      await appHiveClient.Scripting.callScript(
        scriptName,
        {
          guid: (space as any).guid,
          followers: [...new Set(followers)]
        },
        `${process.env.REACT_APP_APPLICATION_DID}`,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );
    }
  }
  static async unfollow(session: ISessionItem, space: Space) {
    const followers = space.followers?.filter(
      follower => follower !== session.did
    );
    const appHiveClient = await HiveService.getAnonymousHiveClient();
    if (appHiveClient) {
      const scriptName =
        space.category === SpaceCategory.Personal
          ? 'follow_space'
          : 'follow_community_space';
      await appHiveClient.Scripting.callScript(
        scriptName,
        {
          guid: (space as any).guid,
          followers: [...new Set(followers)]
        },
        `${process.env.REACT_APP_APPLICATION_DID}`,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );
    }
  }
}
