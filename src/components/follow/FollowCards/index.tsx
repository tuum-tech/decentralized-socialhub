import React, { useEffect, useState } from 'react';

import { loadFollowingUsers, loadFollowerUsers } from 'src/utils/follow';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface Props {
  did: string;
  signed: boolean;
  viewAll: (isFollower: boolean) => void;
}

const FowllowCards: React.FC<Props> = ({ did, signed, viewAll }: Props) => {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      const _followings = await loadFollowingUsers(did);
      setFollowingUsers(_followings);
      const _followers = await loadFollowerUsers(did);
      setFollowerUsers(_followers);
    })();
  }, [did]);
  return (
    <>
      {followingUsers.length > 0 && (
        <FollowingCard
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
      {followerUsers.length > 0 && (
        <FollowerCard
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
