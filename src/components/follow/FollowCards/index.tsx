import React, { useEffect, useState } from 'react';

import { SearchService } from 'src/services/search.service';
import { FollowService } from 'src/services/follow.service';
import { getItemsFromData } from 'src/utils/script';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface Props {
  did: string;
  signed: boolean;
  viewAll: (isFollower: boolean) => void;
}

const FowllowCards: React.FC<Props> = ({ did, signed, viewAll }: Props) => {
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);

  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();

      const _followingDids = await FollowService.getFollowingDids(did);
      setFollowingDids(_followingDids);
      let followings: any = await searchServiceLocal.getUsersByDIDs(
        _followingDids,
        5,
        0
      );
      followings = getItemsFromData(followings, 'get_users_by_dids');
      setFollowerUsers(followings);

      const _followersDids = await FollowService.getFollowerDids(did);
      setFollowerDids(_followersDids);
      let followers: any = await searchServiceLocal.getUsersByDIDs(
        _followersDids,
        5,
        0
      );
      followers = getItemsFromData(followers, 'get_users_by_dids');
      setFollowingUsers(followers);
    })();
  }, [did]);
  return (
    <>
      {followingDids.length > 0 && (
        <FollowingCard
          totalNumber={followingDids.length}
          users={
            followingUsers.length > 5
              ? followingUsers.slice(0, 5)
              : followingUsers
          }
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
          viewAllClicked={() => viewAll(false)}
        />
      )}
      {followerDids.length > 0 && (
        <FollowerCard
          totalNumber={followerDids.length}
          users={
            followerUsers.length > 5 ? followerUsers.slice(0, 5) : followerUsers
          }
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
          viewAllClicked={() => viewAll(true)}
        />
      )}
    </>
  );
};

export default FowllowCards;
