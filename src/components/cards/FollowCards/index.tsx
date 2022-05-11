import React, { useEffect, useState } from 'react';

import { SearchService } from 'src/services/search.service';
import { FollowType } from 'src/services/user.service';
import { getItemsFromData } from 'src/utils/script';
import { getDIDString } from 'src/utils/did';

import FollowCard from './FollowCard';

interface Props {
  signed: boolean;
  viewAll: (ctype: FollowType) => void;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
  showFollowerCard?: boolean;
  showFollowingCard?: boolean;
  showMutualFollowerCard?: boolean;
  template?: string;
}

const FowllowCards: React.FC<Props> = ({
  followerDids,
  followingDids,
  mutualDids,
  signed,
  viewAll,
  showFollowerCard = true,
  showFollowingCard = true,
  showMutualFollowerCard = true,
  template = 'default'
}: Props) => {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  const [mutualFollowerUsers, setMutualFollowerUsers] = useState<any[]>([]);
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

      let mutualFollowers: any = await searchServiceLocal.getUsersByDIDs(
        mutualDids,
        5,
        0
      );
      mutualFollowers = getItemsFromData(mutualFollowers, 'get_users_by_dids');
      setMutualFollowerUsers(mutualFollowers);
    })();
  }, [followerDids, followingDids, mutualDids]);
  return (
    <>
      {followingDids.length > 0 && showFollowingCard && (
        <FollowCard
          title={`Following (${followingDids.length})`}
          users={
            followingUsers.length > 5
              ? followingUsers.slice(0, 5)
              : followingUsers
          }
          getLinkFunc={(did: string) => getDIDString('/did/' + did)}
          viewAllClicked={() => viewAll(FollowType.Following)}
          template={template}
        />
      )}
      {followerDids.length > 0 && showFollowerCard && (
        <FollowCard
          title={`Follower (${followerDids.length})`}
          users={
            followerUsers.length > 5 ? followerUsers.slice(0, 5) : followerUsers
          }
          getLinkFunc={(did: string) => getDIDString('/did/' + did)}
          viewAllClicked={() => viewAll(FollowType.Follower)}
          template={template}
        />
      )}
      {mutualDids.length > 0 && showMutualFollowerCard && (
        <FollowCard
          title={`Mutual Follower (${mutualDids.length})`}
          users={
            mutualFollowerUsers.length > 5
              ? mutualFollowerUsers.slice(0, 5)
              : mutualFollowerUsers
          }
          getLinkFunc={(did: string) => getDIDString('/did/' + did)}
          viewAllClicked={() => viewAll(FollowType.MutualFollower)}
          template={template}
        />
      )}
    </>
  );
};

export default FowllowCards;
