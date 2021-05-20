import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { loadFollowingUsers, loadFollowerUsers } from 'src/utils/follow';
import { TuumTechScriptService } from 'src/services/script.service';

import FollowerCard from './FollowerCard';
import FollowingCard from './FollowingCard';

interface Props {
  did: string;
  signed: boolean;
}

const FowllowCards: React.FC<Props> = ({ did, signed }: Props) => {
  const [followingUsers, setFollowingUsers] = useState<any[]>([]);
  const [followerUsers, setFollowerUsers] = useState<any[]>([]);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      const _followingDids = await loadFollowingUsers(did);
      const _followersDids = await loadFollowerUsers(did);

      const followings = await TuumTechScriptService.searchUserWithDIDs(
        _followingDids,
        5,
        0
      );
      setFollowingUsers(followings);

      const followers = await TuumTechScriptService.searchUserWithDIDs(
        _followersDids,
        5,
        0
      );
      setFollowerUsers(followers);
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
          viewAllClicked={() => {
            history.push('/connections/followings');
          }}
        />
      )}
      {followerUsers.length > 0 && (
        <FollowerCard
          users={
            followerUsers.length > 5 ? followerUsers.slice(0, 5) : followerUsers
          }
          getLinkFunc={(did: string) => '/did/' + did}
          isSigned={signed}
          viewAllClicked={() => {
            history.push('/connections/followers');
          }}
        />
      )}
    </>
  );
};

export default FowllowCards;
