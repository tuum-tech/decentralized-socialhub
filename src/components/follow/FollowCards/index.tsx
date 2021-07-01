import React, { useEffect, useState } from 'react';

import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface Props {
  signed: boolean;
  viewAll: (isFollower: boolean) => void;
  followerDids: string[];
  followingDids: string[];
  showFollowerCard?: boolean;
  showFollowingCard?: boolean;
  template?: string;
}

const FowllowCards: React.FC<Props> = ({
  followerDids,
  followingDids,
  signed,
  viewAll,
  showFollowerCard = true,
  showFollowingCard = true,
  template = 'default'
}: Props) => {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();

      let followings: any = await searchServiceLocal.getUsersByDIDs(
        followingDids,
        5,
        0
      );
      followings = getItemsFromData(followings, 'get_users_by_dids');
      setFollowingUsers(followings);

      let followers: any = await searchServiceLocal.getUsersByDIDs(
        followerDids,
        5,
        0
      );
      followers = getItemsFromData(followers, 'get_users_by_dids');
      setFollowerUsers(followers);
    })();
  }, [followerDids, followingDids]);
  return (
    <>
      {followingDids.length > 0 && showFollowingCard && (
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
          template={template}
        />
      )}
      {followerDids.length > 0 && showFollowerCard && (
        <FollowerCard
          totalNumber={followerDids.length}
          users={
            followerUsers.length > 5 ? followerUsers.slice(0, 5) : followerUsers
          }
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
          viewAllClicked={() => viewAll(true)}
          template={template}
        />
      )}
    </>
  );
};

export default FowllowCards;
