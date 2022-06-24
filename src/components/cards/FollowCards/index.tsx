import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { FollowType } from 'src/services/user.service';
import { getDIDString } from 'src/utils/did';

import { getUsersByDid as getUsersByDidAction } from 'src/store/users/actions';
import { selectAllUsers } from 'src/store/users/selectors';
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

const FollowCards: React.FC<Props> = ({
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
  const dispatch = useDispatch();
  const users = useSelector(selectAllUsers);

  const getUsersByDid = useCallback(
    (ids, limit, offset) => {
      dispatch(getUsersByDidAction(ids, limit, offset));
    },
    [dispatch]
  );

  useEffect(() => {
    getUsersByDid(
      [
        ...followingDids.slice(0, 5),
        ...followerDids.slice(0, 5),
        ...mutualDids.slice(0, 5)
      ],
      15,
      0
    );
  }, [followerDids, followingDids, mutualDids]);

  return (
    <>
      {followingDids.length > 0 && showFollowingCard && (
        <FollowCard
          title={`Following (${followingDids.length})`}
          users={users.filter(user => followingDids.includes(user.did))}
          getLinkFunc={(did: string) => getDIDString('/did/' + did)}
          viewAllClicked={() => viewAll(FollowType.Following)}
          template={template}
        />
      )}
      {followerDids.length > 0 && showFollowerCard && (
        <FollowCard
          title={`Follower (${followerDids.length})`}
          users={users.filter(user => followerDids.includes(user.did))}
          getLinkFunc={(did: string) => getDIDString('/did/' + did)}
          viewAllClicked={() => viewAll(FollowType.Follower)}
          template={template}
        />
      )}
      {mutualDids.length > 0 && showMutualFollowerCard && (
        <FollowCard
          title={`Mutual Follower (${mutualDids.length})`}
          users={users.filter(user => mutualDids.includes(user.did))}
          getLinkFunc={(did: string) => getDIDString('/did/' + did)}
          viewAllClicked={() => viewAll(FollowType.MutualFollower)}
          template={template}
        />
      )}
    </>
  );
};

export default FollowCards;
