import { ProfileService } from 'src/services/profile.service';

export const loadFollowingUserDids = async (did: string) => {
  let followingDidArray: string[] = [];
  const followingRes = (await ProfileService.getFollowings(
    did
  )) as IFollowingResponse;
  if (
    followingRes &&
    followingRes.get_following &&
    followingRes.get_following.items.length > 0
  ) {
    followingDidArray = followingRes.get_following.items.map(item => item.did);
  }
  return followingDidArray;
};

export const loadFollowerUserDids = async (did: string) => {
  let follwerDidArray: string[] = [];
  let followersRes = (await ProfileService.getFollowers([
    did
  ])) as IFollowerResponse;
  if (
    followersRes &&
    followersRes.get_followers &&
    followersRes.get_followers.items.length > 0
  ) {
    follwerDidArray = followersRes.get_followers.items[0].followers;
  }
  return follwerDidArray;
};
