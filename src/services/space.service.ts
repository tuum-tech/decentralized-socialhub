import _ from 'lodash';
import { getItemsFromData } from 'src/utils/script';
import { TuumTechScriptService } from './script.service';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { showNotify } from 'src/utils/notify';
import { Guid } from 'guid-typescript';
import { Logger } from 'src/shared-base/logger';
import { TuumTechScriptService } from './script.service';
import { ISession } from 'src/context/session.context';

export enum SpaceCategory {
  Personal = 'Personal Group',
  NFT = 'NFT Collection',
  Org = 'Organization',
  Univ = 'University',
  WTP = 'Welcome to Profile'
}

export const defaultSpace: Space = {
  guid: null,
  name: '',
  slug: '',
  description: '',
  category: SpaceCategory.Personal,
  avatar: '',
  coverPhoto: '',
  publicFields: [],
  followers: [],
  socialLinks: {},
  tags: []
};
export class SpaceService {
  private static LOG = new Logger('SpaceService');

  static async getAllSpaces(session?: ISessionItem) {
    const c_spaces = await this.getCommunitySpaces(session);
    const p_spaces = await this.getPrivateSpaces(session);
    return p_spaces.concat(c_spaces);
  }

  static async getPrivateSpaces(session?: ISessionItem) {
    let spaces: any[] = [];
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
      const users = await TuumTechScriptService.searchUserWithDIDs(
        Object.keys(groups)
      );
      spaces = await Promise.all(
        users.map(async (user: any) => {
          const guids = groups[user.did].map((x: any) => x.guid);
          const _spaces = await this.getSpaceByIds(user, guids);
          return _spaces.map((x: any) => {
            const y = groups[user.did].find(
              (y: any) => y.guid.value === x.guid.value
            );
            return {
              ...x,
              ...y
            };
          });
        })
      );
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
      /*       spaces = spaces.filter((space: any) =>
        space.owner.includes(
          session && session.did ? session.did : space.owner[0]
        )
      ); */
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
  static async getSpaceById(session: ISessionItem, guid: Guid) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const result: IRunScriptResponse<SpacesResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_space_by_ids',
          params: { guids: [guid] },
          context: {
            target_did: session.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const spaces = getItemsFromData(result, 'get_space_by_ids');
      if (!spaces.length) {
        return null;
      }

      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        const response = await appHiveClient.Scripting.RunScript({
          name: 'get_space_by_ids',
          params: { guids: [guid] },
          context: {
            target_did: process.env.REACT_APP_APPLICATION_DID,
            target_app_did: process.env.REACT_APP_APPLICATION_ID
          }
        });
        let items = getItemsFromData(response, 'get_space_by_ids');
        if (!items.length) {
          return null;
        }

        return { ...items[0], ...spaces[0] };
      }
    }
    return null;
  }
  static async getCommunitySpaceByNames(names: string[]) {
    try {
      const appHiveClient = await HiveService.getApplicationHiveClient(
        `${process.env.REACT_APP_HIVE_HOST}`
      );
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
    let resp;
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
          const appHiveClient = await HiveService.getAppHiveClient();
          if (appHiveClient) {
            resp = await appHiveClient.Scripting.RunScript({
              name: 'add_space',
              params: {
                guid: (space as any).guid,
                owner: session.did,
                followers: [session.did]
              },
              context: {
                target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
                target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
              }
            });
            if (notify)
              showNotify(
                'Space details has been successfully saved',
                'success'
              );
          }
        }
      } else {
        const appHiveClient = await HiveService.getApplicationHiveClient();
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
    } else {
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        resp = await appHiveClient.Scripting.RunScript({
          name: 'add_community_space',
          params: space,
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
        if (notify)
          showNotify('Space details has been successfully saved', 'success');
      }
    }
    return resp;
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
        if (res.isSuccess && res.response._status === 'OK') {
          const appHiveClient = await HiveService.getApplicationHiveClient();
          if (appHiveClient) {
            await appHiveClient.Scripting.callScript(
              'remove_space',
              { name: space.name, owner: session.did },
              `${process.env.REACT_APP_APPLICATION_ID}`,
              `${process.env.REACT_APP_APPLICATION_DID}`
            );
          }
          showNotify('Space has been successfuly removed', 'success');
        }
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
  static async getPosts(
    sid: string,
    offset: number,
    limit: number,
    admin: boolean = false
  ) {
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (!appHiveClient) return [];
    const tuumVaultRes = await appHiveClient.Scripting.callScript(
      'get_space_posts',
      {
        space_sid: sid,
        limit: 200,
        skip: 0
      },
      `${process.env.REACT_APP_APPLICATION_ID}`,
      `${process.env.REACT_APP_APPLICATION_DID}`
    );
    let posts = getItemsFromData(tuumVaultRes, 'get_space_posts');
    return posts;
  }
  static async getPosts(
    sid: string,
    offset: number,
    limit: number,
    admin: boolean = false
  ) {
    let posts: any[] = await this.getPostList(sid);
    if (!admin) {
      posts = posts.filter((post: any) => post.visible);
    }
    posts = posts.slice(offset, offset + limit);
    const dids = posts.map((post: any) => post.creator);
    const users = await TuumTechScriptService.searchUserWithDIDs(dids);
    return await Promise.all(
      users.map(async (user: any) => {
        const hiveInstance = await HiveService.getHiveClient(tuumUser);
        if (!user || !hiveInstance) {
          return null;
        }
        const post = posts.find((post: any) => post.creator === user.did);
        const userVaultRes: any = await hiveInstance.Scripting.callScript(
          'get_space_post',
          {
            guid: post.post_id
          },
          tuumUser.did,
          `${process.env.REACT_APP_APPLICATION_ID}`
        );

        const data = getItemsFromData(userVaultRes, 'get_space_post');
        return data.length > 0
          ? {
              ...post,
              content: data[0].content,
              comments: data[0].comments
            }
          : null;
      })
    );
  }
  static async post(session: ISessionItem, sid: string, content: string) {
    const hiveInstance = await HiveService.getHiveClient(session);
    if (session && hiveInstance) {
      const post = {
        space_id: sid,
        post_id: Guid.create(),
        creator: session.did,
        visible: true,
        comments_visibility: {},
        content: content,
        comments: {}
      };
      const res: any = await hiveInstance.Scripting.callScript(
        'update_space_post',
        {
          guid: post.post_id,
          content: post.content,
          comments: post.comments
        },
        session.did,
        `${process.env.REACT_APP_APPLICATION_ID}`
      );
      if (res.isSuccess && res.response._status === 'OK') {
        const appHiveClient = await HiveService.getApplicationHiveClient();
        if (appHiveClient) {
          await appHiveClient.Scripting.callScript(
            'update_space_post',
            post,
            `${process.env.REACT_APP_APPLICATION_ID}`,
            `${process.env.REACT_APP_APPLICATION_DID}`
          );
          return post;
        }
      }
    }
    return null;
  }
  static async comment(creator: string, post: any, content: string) {
    let didService = await DidService.getInstance();
    let userService = new UserService(didService);
    const tuumUser = await userService.SearchUserWithDID(post.creator);
    const hiveInstance = await HiveService.getHiveClient(tuumUser);
    if (!tuumUser || !hiveInstance) return;
    const commentIds = Object.keys(post.comments);
    const newId =
      commentIds.length > 0
        ? parseInt(commentIds[commentIds.length - 1]) + 1
        : 1;
    post.comments[newId] = {
      creator,
      content,
      created: new Date().getTime(),
      modified: new Date().getTime()
    };
    post.comments_visibility[newId] = true;
    const res: any = await hiveInstance.Scripting.callScript(
      'update_space_post',
      {
        guid: post.post_id,
        content: post.content,
        comments: post.comments
      },
      tuumUser.did,
      `${process.env.REACT_APP_APPLICATION_ID}`
    );
    if (res.isSuccess && res.response._status === 'OK') {
      const appHiveClient = await HiveService.getApplicationHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.callScript(
          'update_space_post',
          post,
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        return post;
      }
    }
    return null;
  }
  static async removePost(post: any) {
    let didService = await DidService.getInstance();
    let userService = new UserService(didService);
    const tuumUser = await userService.SearchUserWithDID(post.creator);
    const hiveInstance = await HiveService.getHiveClient(tuumUser);
    if (!tuumUser || !hiveInstance) return;
    const res: any = await hiveInstance.Scripting.callScript(
      'remove_space_post',
      {
        guid: post.post_id
      },
      tuumUser.did,
      `${process.env.REACT_APP_APPLICATION_ID}`
    );
    if (res.isSuccess && res.response._status === 'OK') {
      const appHiveClient = await HiveService.getApplicationHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.callScript(
          'remove_space_post',
          {
            post_id: post.post_id
          },
          `${process.env.REACT_APP_APPLICATION_DID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
      }
    }
  }
  static async removeComment(post: any, comment_id: string) {
    let didService = await DidService.getInstance();
    let userService = new UserService(didService);
    const tuumUser = await userService.SearchUserWithDID(post.creator);
    const hiveInstance = await HiveService.getHiveClient(tuumUser);
    if (!tuumUser || !hiveInstance) return null;
    delete post.comments[comment_id];
    delete post.comments_visibility[comment_id];
    const res: any = await hiveInstance.Scripting.callScript(
      'update_space_post',
      {
        guid: post.post_id,
        content: post.content,
        comments: post.comments
      },
      tuumUser.did,
      `${process.env.REACT_APP_APPLICATION_ID}`
    );
    if (res.isSuccess && res.response._status === 'OK') {
      const appHiveClient = await HiveService.getApplicationHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.callScript(
          'update_space_post',
          post,
          `${process.env.REACT_APP_APPLICATION_ID}`,
          `${process.env.REACT_APP_APPLICATION_DID}`
        );
        return post;
      }
    }
    return null;
  }
  static async showOrHidePost(post: any) {
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (appHiveClient) {
      post.visible = !post.visible;
      await appHiveClient.Scripting.callScript(
        'update_space_post',
        post,
        `${process.env.REACT_APP_APPLICATION_ID}`,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );
      return post;
    }
    return null;
  }
  static async showOrHideComment(post: any, comment_id: string) {
    const appHiveClient = await HiveService.getApplicationHiveClient();
    if (appHiveClient) {
      post.comments_visibility[comment_id] = !post.comments_visibility[
        comment_id
      ];
      await appHiveClient.Scripting.callScript(
        'update_space_post',
        post,
        `${process.env.REACT_APP_APPLICATION_DID}`,
        `${process.env.REACT_APP_APPLICATION_DID}`
      );
      return post;
    }
    return null;
  }
}
