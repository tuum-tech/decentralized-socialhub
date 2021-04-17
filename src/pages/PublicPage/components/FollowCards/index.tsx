import React, { useEffect, useState } from 'react';

import { ProfileService } from 'src/services/profile.service';
import { IUserResponse, SearchService } from 'src/services/search.service';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface Props {
  did: string;
  signed: boolean;
}

const FowllowCards: React.FC<Props> = ({ did, signed }: Props) => {
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUserResponse>({
    get_users: { items: [] }
  });
  const resolveUserInfo = (did: string): any => {
    const userIndex = filteredUsers.get_users.items.findIndex(
      item => item.did === did
    );
    const user = filteredUsers.get_users.items[userIndex];
    return {
      name: user ? user.name : 'Anonymous',
      image: user ? user.avatar : ''
    };
  };
  const loadFollowingDdata = async (did: string) => {
    let followingDidArray: string[] = [];
    const followingRes = (await ProfileService.getFollowings(
      did
    )) as IFollowingResponse;
    if (
      followingRes &&
      followingRes.get_following &&
      followingRes.get_following.items.length > 0
    ) {
      followingDidArray = followingRes.get_following.items.map(
        item => item.did
      );
    }
    setFollowingDids(followingDidArray);
    return followingDidArray;
  };
  const loadFollowerData = async (did: string) => {
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
    setFollowerDids(follwerDidArray);
    return follwerDidArray;
  };
  useEffect(() => {
    (async () => {
      let fUserDids: string[] = await loadFollowingDdata(did);
      fUserDids = fUserDids.concat(await loadFollowerData(did));

      let searchServiceLocal: SearchService;
      try {
        searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
        let listUsers: any = await searchServiceLocal.getUsersByDIDs(
          fUserDids,
          200,
          0
        );
        setFilteredUsers(listUsers.response);
      } catch (e) {
        setFilteredUsers({ get_users: { items: [] } });
      }
    })();
  }, [did]);
  return (
    <>
      {followingDids.length > 0 && (
        <FollowingCard
          dids={followingDids}
          resolveUserFunc={resolveUserInfo}
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
        />
      )}
      {followerDids.length > 0 && (
        <FollowerCard
          dids={followerDids}
          resolveUserFunc={resolveUserInfo}
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
        />
      )}
    </>
  );
};

export default FowllowCards;
