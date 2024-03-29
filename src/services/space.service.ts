import _ from 'lodash';
import { IRunScriptResponse } from '@elastosfoundation/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import { getItemsFromData } from 'src/utils/script';
import { TuumTechScriptService } from './script.service';
import { HiveService } from './hive.service';
import { UserService } from './user.service';
import { DidService } from './did.service.new';
import { showNotify } from 'src/utils/notify';
import { Guid } from 'guid-typescript';

export enum SpaceCategory {
  Personal = 'Personal Group',
  Creator = 'Creator',
  Business = 'Business',
  DAO = 'DAO',
  Personal_NFT = 'Personal NFT Group',
  NFT = 'NFT Collection',
  // Org = 'Organization',
  // Univ = 'University',
  WTP = 'Welcome to Profile'
}

export const CategoriesForPrivateSpace = [
  SpaceCategory.Personal,
  SpaceCategory.Creator,
  SpaceCategory.Business,
  SpaceCategory.DAO,
  SpaceCategory.Personal_NFT
];

export const CategoriesForCommunitySpace = [
  SpaceCategory.NFT,
  SpaceCategory.WTP
];

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
  static async getAllSpaces(session?: ISessionItem) {
    const c_spaces = await this.getCommunitySpaces(session);
    const p_spaces = await this.getPrivateSpaces(session);
    return p_spaces.concat(c_spaces);
  }
  static async getPrivateSpaces(session?: ISessionItem) {
    let spaces: any[] = [];
    let groups: any = {};
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      if (session) {
        const response = await appHiveClient.Scripting.RunScript({
          name: 'get_space_by_owner',
          params: { owner: session.did },
          context: {
            target_did: process.env.REACT_APP_APPLICATION_DID,
            target_app_did: process.env.REACT_APP_APPLICATION_ID
          }
        });
        const items = getItemsFromData(response, 'get_space_by_owner');
        groups[session.did] = items;
      } else {
        const response = await appHiveClient.Scripting.RunScript({
          name: 'get_all_spaces',
          context: {
            target_did: process.env.REACT_APP_APPLICATION_DID,
            target_app_did: process.env.REACT_APP_APPLICATION_ID
          }
        });
        const items = getItemsFromData(response, 'get_all_spaces');
        groups = _.groupBy(items, 'owner');
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
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      const response = await appHiveClient.Scripting.RunScript({
        name: 'get_community_spaces',
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID
        }
      });
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
      const items = getItemsFromData(result, 'get_space_by_names');
      const guids = items.map((x: any) => x.guid);
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        const response = await appHiveClient.Scripting.RunScript({
          name: 'get_space_by_ids',
          params: { guids },
          context: {
            target_did: process.env.REACT_APP_APPLICATION_DID,
            target_app_did: process.env.REACT_APP_APPLICATION_ID
          }
        });
        spaces = getItemsFromData(response, 'get_space_by_ids');
        return spaces.map((x: any) => {
          const y = items.find((y: any) => y.guid.value === x.guid.value);
          return {
            ...x,
            ...y
          };
        });
      }
    }
    return [];
  }
  static async getSpaceByIds(session: ISessionItem, guids: Guid[]) {
    const hiveInstance = await HiveService.getSessionInstance(session);
    if (session && hiveInstance) {
      const result: IRunScriptResponse<SpacesResponse> = await hiveInstance.Scripting.RunScript(
        {
          name: 'get_space_by_ids',
          params: { guids },
          context: {
            target_did: session.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          }
        }
      );
      const spaces = getItemsFromData(result, 'get_space_by_ids');
      return spaces.map((space: any) => ({
        ...space,
        isCommunitySpace: false
      }));
    }
    return [];
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
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      const response = await appHiveClient.Scripting.RunScript({
        name: 'get_community_space_by_names',
        params: { names },
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID
        }
      });
      const spaces = getItemsFromData(response, 'get_community_space_by_names');
      return spaces.map((space: any) => ({ ...space, isCommunitySpace: true }));
    }
    return [];
  }
  static async getCommunitySpaceByIds(guids: Guid[]) {
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      const response = await appHiveClient.Scripting.RunScript({
        name: 'get_community_space_by_ids',
        params: { guids },
        context: {
          target_did: process.env.REACT_APP_APPLICATION_DID,
          target_app_did: process.env.REACT_APP_APPLICATION_ID
        }
      });
      const spaces = getItemsFromData(response, 'get_community_space_by_ids');
      return spaces.map((space: any) => ({ ...space, isCommunitySpace: true }));
    }
    return [];
  }
  static async addSpace(
    session: ISessionItem,
    space: Space,
    notify: boolean = true
  ) {
    let resp;
    if (CategoriesForPrivateSpace.includes(space.category)) {
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
            params: space,
            context: {
              target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          });
          showNotify('Space has been successfully removed', 'success');
        }
      }
    }
  }
  static async follow(session: ISessionItem, space: Space) {
    const followers = [...(space.followers || []), session.did];
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      const scriptName = CategoriesForPrivateSpace.includes(space.category)
        ? 'follow_space'
        : 'follow_community_space';
      await appHiveClient.Scripting.RunScript({
        name: scriptName,
        params: {
          guid: (space as any).guid,
          followers: [...new Set(followers)]
        },
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
    }
  }
  static async unfollow(session: ISessionItem, space: Space) {
    const followers = space.followers?.filter(
      follower => follower !== session.did
    );
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      const scriptName = CategoriesForPrivateSpace.includes(space.category)
        ? 'follow_space'
        : 'follow_community_space';
      await appHiveClient.Scripting.RunScript({
        name: scriptName,
        params: {
          guid: (space as any).guid,
          followers: [...new Set(followers)]
        },
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
    }
  }
  static async getPostList(sid: string) {
    const appHiveClient = await HiveService.getAppHiveClient();
    if (!appHiveClient) return [];
    const tuumVaultRes = await appHiveClient.Scripting.RunScript({
      name: 'get_space_posts',
      params: {
        space_id: sid,
        limit: 200,
        skip: 0
      },
      context: {
        target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
        target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
      }
    });
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
    const groups = _.groupBy(posts, 'creator');
    const users = await TuumTechScriptService.searchUserWithDIDs(
      Object.keys(groups)
    );
    posts = await Promise.all(
      users.map(async (user: any) => {
        const hiveInstance = await HiveService.getSessionInstance(user);
        if (!user || !hiveInstance) {
          return [];
        }
        const guids = groups[user.did].map((x: any) => x.post_id);
        const userVaultRes: any = await hiveInstance.Scripting.RunScript({
          name: 'get_space_posts',
          context: {
            target_did: user.did,
            target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
          },
          params: { guids }
        });
        const data: any[] = getItemsFromData(userVaultRes, 'get_space_posts');
        return data.map(({ guid, content, comments }) => {
          const x = groups[user.did].find(
            (x: any) => x.post_id.value === guid.value
          );
          return { ...x, content, comments };
        });
      })
    );
    posts = posts.reduce((total, x) => total.concat(x), []);
    return posts;
  }
  static async post(session: ISessionItem, sid: string, content: string) {
    const hiveInstance = await HiveService.getSessionInstance(session);
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
      const res: any = await hiveInstance.Scripting.RunScript({
        name: 'update_space_post',
        context: {
          target_did: session.did,
          target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
        },
        params: {
          guid: post.post_id,
          content: post.content,
          comments: post.comments
        }
      });
      if (res.isSuccess && res.response._status === 'OK') {
        const appHiveClient = await HiveService.getAppHiveClient();
        if (appHiveClient) {
          await appHiveClient.Scripting.RunScript({
            name: 'update_space_post',
            params: post,
            context: {
              target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
              target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
            }
          });
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
    const hiveInstance = await HiveService.getSessionInstance(tuumUser);
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
    const res: any = await hiveInstance.Scripting.RunScript({
      name: 'update_space_post',
      context: {
        target_did: tuumUser.did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      },
      params: {
        guid: post.post_id,
        content: post.content,
        comments: post.comments
      }
    });
    if (res.isSuccess && res.response._status === 'OK') {
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'update_space_post',
          params: post,
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
        return post;
      }
    }
    return null;
  }
  static async removePost(post: any) {
    let didService = await DidService.getInstance();
    let userService = new UserService(didService);
    const tuumUser = await userService.SearchUserWithDID(post.creator);
    const hiveInstance = await HiveService.getSessionInstance(tuumUser);
    if (!tuumUser || !hiveInstance) return;
    const res: any = await hiveInstance.Scripting.RunScript({
      name: 'remove_space_post',
      context: {
        target_did: tuumUser.did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      },
      params: {
        guid: post.post_id
      }
    });
    if (res.isSuccess && res.response._status === 'OK') {
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'remove_space_post',
          params: {
            post_id: post.post_id
          },
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
      }
    }
  }
  static async removeComment(post: any, comment_id: string) {
    let didService = await DidService.getInstance();
    let userService = new UserService(didService);
    const tuumUser = await userService.SearchUserWithDID(post.creator);
    const hiveInstance = await HiveService.getSessionInstance(tuumUser);
    if (!tuumUser || !hiveInstance) return null;
    delete post.comments[comment_id];
    delete post.comments_visibility[comment_id];
    const res: any = await hiveInstance.Scripting.RunScript({
      name: 'update_space_post',
      context: {
        target_did: tuumUser.did,
        target_app_did: `${process.env.REACT_APP_APPLICATION_ID}`
      },
      params: {
        guid: post.post_id,
        content: post.content,
        comments: post.comments
      }
    });
    if (res.isSuccess && res.response._status === 'OK') {
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient) {
        await appHiveClient.Scripting.RunScript({
          name: 'update_space_post',
          params: post,
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
        return post;
      }
    }
    return null;
  }
  static async showOrHidePost(post: any) {
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      post.visible = !post.visible;
      await appHiveClient.Scripting.RunScript({
        name: 'update_space_post',
        params: post,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      return post;
    }
    return null;
  }
  static async showOrHideComment(post: any, comment_id: string) {
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient) {
      post.comments_visibility[comment_id] = !post.comments_visibility[
        comment_id
      ];
      await appHiveClient.Scripting.RunScript({
        name: 'update_space_post',
        params: post,
        context: {
          target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
          target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
        }
      });
      return post;
    }
    return null;
  }
}
