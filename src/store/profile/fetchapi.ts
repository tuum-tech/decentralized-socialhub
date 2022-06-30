import { FollowService } from 'src/services/follow.service';
import { ProfileService } from 'src/services/profile.service';

export async function fetchFollowingDIDsApi(did: string): Promise<any> {
  return FollowService.getFollowingDids(did);
}

export async function fetchFollowerDIDsApi(did: string): Promise<any> {
  return FollowService.getFollowerDids(did);
}

export async function fetchFullProfile(did: string, userSession: ISessionItem) {
  return ProfileService.getFullProfile(did, userSession);
}
