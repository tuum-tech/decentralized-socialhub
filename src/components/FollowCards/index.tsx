import React, { useEffect, useState } from 'react';

import { IUserResponse, SearchService } from 'src/services/search.service';
import { loadFollowingUsers, loadFollowerUsers } from 'src/utils/follow';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface Props {
  did: string;
  signed: boolean;
}

const FowllowCards: React.FC<Props> = ({ did, signed }: Props) => {
  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const followingDidArray = await loadFollowingUsers(did);
      setFollowingDids(followingDidArray);
      const followerDidArray = await loadFollowerUsers(did);
      setFollowerDids(followerDidArray);
    })();
  }, [did]);
  return (
    <>
      {followingDids.length > 0 && (
        <FollowingCard
          users={
            followingDids.length > 5 ? followingDids.slice(0, 5) : followingDids
          }
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
        />
      )}
      {followerDids.length > 0 && (
        <FollowerCard
          users={
            followerDids.length > 5 ? followerDids.slice(0, 5) : followerDids
          }
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
        />
      )}
    </>
  );
};

export default FowllowCards;
