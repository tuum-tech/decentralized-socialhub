import { ProfileService } from 'src/services/profile.service';
// import { SearchService } from 'src/services/search.service';
// import { HiveService } from 'src/services/hive.service';
import { getItemsFromData } from './script';

// const PAGE_LIMIT = 200;

// const getUsersInTuumVault = async (dids: string[]) => {
//   //  get only users that exist on tuum vault
//   let usersInTuumVault: string[] = dids;
//   let searchServiceLocal: SearchService;
//   try {
//     searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
//     const listUsers: any = await searchServiceLocal.getUsersByDIDs(
//       dids,
//       PAGE_LIMIT,
//       0
//     );
//     usersInTuumVault = getItemsFromData(listUsers, 'get_users_by_dids').map(
//       (item: any) => item.did
//     );

//     // remove users that are not in tuum.vaule users
//     const appHiveClient = await HiveService.getAppHiveClient();
//     if (appHiveClient && dids.length !== usersInTuumVault.length) {
//       let not_existing_users = dids.filter(
//         (did: string) => !usersInTuumVault.includes(did)
//       );
//       const params: any = {
//         limit: PAGE_LIMIT,
//         skip: 0,
//         dids: not_existing_users
//       };
//       await appHiveClient.Scripting.RunScript({
//         name: 'delete_users',
//         params: params,
//         context: {
//           target_did: `${process.env.REACT_APP_APPLICATION_ID}`,
//           target_app_did: `${process.env.REACT_APP_APPLICATION_DID}`
//         }
//       });
//     }
//   } catch (e) {}
//   return usersInTuumVault;
// };

// const syncFollowData = async (dids: string[]) => {
//   let res_user_dids: string[] = dids;
//   res_user_dids = await getUsersInTuumVault(dids);
//   return res_user_dids;
// };

// export const addDetailsToFollowData = async (
//   dids: string[],
//   pageNumber: number,
//   pageSize: number
// ) => {
//   let res_users: any[] = [];
//   let searchServiceLocal: SearchService;

//   try {
//     searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
//     const listUsers: any = await searchServiceLocal.getUsersByDIDs(
//       dids,
//       pageSize,
//       (pageNumber - 1) * pageSize
//     );
//     res_users = getItemsFromData(listUsers, 'get_users_by_dids').map(
//       (user: any) => {
//         const newobj = {
//           name: user.name,
//           avatar: user.avatar || '',
//           did: user.did
//         };
//         return newobj;
//       }
//     );
//   } catch (e) {}
//   return res_users;
// };

export const loadFollowingUsers = async (did: string) => {
  const followingRes = (await ProfileService.getFollowings(
    did
  )) as IFollowingResponse;
  let followingDids = getItemsFromData(followingRes, 'get_following').map(
    (item: any) => item.did
  );
  return followingDids;
};

export const loadFollowerUsers = async (did: string) => {
  const followersRes = (await ProfileService.getFollowers([
    did
  ])) as IFollowerResponse;
  let followerDids = [];

  const array_res = getItemsFromData(followersRes, 'get_followers');
  if (array_res.length > 0) {
    followerDids = array_res[0].followers;
  }
  // followerDids = await syncFollowData(followerDids);
  return followerDids;
};
