import { FollowService } from 'src/services/follow.service';

export async function fetchFollowingDIDsApi(did: string): Promise<any> {
  return FollowService.getFollowingDids(did);
}

export async function fetchFollowerDIDsApi(did: string): Promise<any> {
  return FollowService.getFollowerDids(did);
}
