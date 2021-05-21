import { getItemsFromData } from '../utils/script';
import { ProfileService } from 'src/services/profile.service';
import { SearchService } from 'src/services/search.service';
import { HiveService } from 'src/services/hive.service';

export class FollowService {
  private static async getUsersInTuumVault(dids: string[]) {
    //  get only users that exist on tuum vault
    let usersInTuumVault: string[] = dids;
    let searchServiceLocal: SearchService;
    try {
      searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      const listUsers: any = await searchServiceLocal.getUsersByDIDs(
        dids,
        200,
        0
      );
      usersInTuumVault = getItemsFromData(listUsers, 'get_users_by_dids').map(
        (item: any) => item.did
      );

      // remove users that are not in tuum.vaule users
      const appHiveClient = await HiveService.getAppHiveClient();
      if (appHiveClient && dids.length !== usersInTuumVault.length) {
        let not_existing_users = dids.filter(
          (did: string) => !usersInTuumVault.includes(did)
        );
        const params: any = {
          limit: 200,
          skip: 0,
          dids: not_existing_users
        };
        await appHiveClient.Scripting.RunScript({
          name: 'delete_users',
          params: params,
          context: {
            target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
            target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
          }
        });
      }
    } catch (e) {}
    return usersInTuumVault;
  }

  private static async syncFollowData(dids: string[]) {
    let res_user_dids: string[] = dids;
    res_user_dids = await this.getUsersInTuumVault(dids);
    return res_user_dids;
  }

  public static async getFollowerDids(did: string) {
    const followersRes = (await ProfileService.getFollowers([
      did
    ])) as IFollowerResponse;
    let followerDids = [];

    const array_res = getItemsFromData(followersRes, 'get_followers');
    if (array_res.length > 0) {
      followerDids = array_res[0].followers;
    }
    followerDids = await this.syncFollowData(followerDids);
    return followerDids;
  }

  public static async getFollowingDids(did: string) {
    const followingRes = (await ProfileService.getFollowings(
      did
    )) as IFollowingResponse;
    let followingDids = getItemsFromData(followingRes, 'get_following').map(
      (item: any) => item.did
    );
    followingDids = await this.syncFollowData(followingDids);
    return followingDids;
  }

  public static async invokeSearch(
    dids: string[],
    searchQuery: string,
    pageSize = 200,
    pageNumber = 1
  ) {
    const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    if (searchQuery === '') {
      const res: any = await searchServiceLocal.getUsersByDIDs(
        dids,
        pageSize,
        (pageNumber - 1) * pageSize
      );
      return getItemsFromData(res, 'get_users_by_dids');
    }

    const res: any = await searchServiceLocal.filterUserNameAndDids(
      searchQuery,
      dids,
      pageSize,
      (pageNumber - 1) * pageSize
    );
    return res;
  }
}
