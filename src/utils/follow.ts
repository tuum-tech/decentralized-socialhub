import { ProfileService } from 'src/services/profile.service';
import { SearchService } from 'src/services/search.service';
import { HiveService } from 'src/services/hive.service';

const PAGE_LIMIT = 200;

const getUsersInTuumVault = async (dids: string[]) => {
  //  get only users that exist on tuum vault
  let usersInTuumVault: string[] = dids;
  let searchServiceLocal: SearchService;
  try {
    searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    const listUsers: any = await searchServiceLocal.getUsersByDIDs(
      dids,
      PAGE_LIMIT,
      0
    );
    if (
      listUsers.response &&
      listUsers.response.get_users &&
      listUsers.response.get_users.items &&
      listUsers.response.get_users.items.length > 0
    ) {
      usersInTuumVault = listUsers.response.get_users.items.map(
        (item: any) => item.did
      );
    }

    // remove users that are not in tuum.vaule users
    const appHiveClient = await HiveService.getAppHiveClient();
    if (appHiveClient && dids.length !== usersInTuumVault.length) {
      let not_existing_users = dids.filter(
        (did: string) => !usersInTuumVault.includes(did)
      );
      const params: any = {
        limit: PAGE_LIMIT,
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
};

const addDetailsToFollowData = async (dids: string[]) => {
  let res_users: any[] = [];
  let searchServiceLocal: SearchService;

  try {
    searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    const listUsers: any = await searchServiceLocal.getUsersByDIDs(
      dids,
      PAGE_LIMIT,
      0
    );
    if (
      listUsers &&
      listUsers.response &&
      listUsers.response.get_users &&
      listUsers.response.get_users.items &&
      listUsers.response.get_users.items.length > 0
    ) {
      res_users = listUsers.response.get_users.items.map((user: any) => {
        const newobj = {
          name: user.name,
          avatar: user.avatar || '',
          did: user.did
        };
        return newobj;
      });
    }
  } catch (e) {}
  return res_users;
};

const syncFollowData = async (dids: string[]) => {
  let res_user_dids: string[] = dids;
  res_user_dids = await getUsersInTuumVault(dids);
  return res_user_dids;
};

export const loadFollowingUsers = async (did: string) => {
  let followingDids: string[] = [];
  const followingRes = (await ProfileService.getFollowings(
    did
  )) as IFollowingResponse;
  if (
    followingRes &&
    followingRes.get_following &&
    followingRes.get_following.items.length > 0
  ) {
    followingDids = followingRes.get_following.items.map(item => item.did);
  }

  followingDids = await syncFollowData(followingDids);
  const followingUsers: any[] = await addDetailsToFollowData(followingDids);
  return followingUsers;
};

export const loadFollowerUsers = async (did: string) => {
  let follwerDids: string[] = [];
  let followersRes = (await ProfileService.getFollowers([
    did
  ])) as IFollowerResponse;
  if (
    followersRes &&
    followersRes.get_followers &&
    followersRes.get_followers.items.length > 0
  ) {
    follwerDids = followersRes.get_followers.items[0].followers;
  }
  follwerDids = await syncFollowData(follwerDids);
  const followerUsers: any[] = await addDetailsToFollowData(follwerDids);
  return followerUsers;
};
