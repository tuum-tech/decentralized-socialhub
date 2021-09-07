import React from 'react';

import { FollowType } from 'src/services/user.service';

import FollowerAll from './FollowerAll';
import FollowingAll from './FollowingAll';
import MutualFollowerAll from './MutualFollowerAll';
import style from './style.module.scss';

interface Props {
  followType: FollowType;
  editable: boolean;
  onClose: () => void;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
  setFollowerDids: (dids: string[]) => void;
  setFollowingDids: (dids: string[]) => void;
  userSession: ISessionItem;
}

const ViewAllFollowModal = ({
  followType,
  editable,
  onClose,
  followerDids,
  followingDids,
  mutualDids,
  setFollowerDids,
  setFollowingDids,
  userSession
}: Props) => (
  <div className={style['modal']}>
    <div className={style['modal_container']}>
      <div className={style['modal_content']}>
        {followType === FollowType.Follower && (
          <FollowerAll
            followerDids={followerDids}
            followingDids={followingDids}
            editable={editable}
            onClose={onClose}
            setFollowingDids={setFollowingDids}
            userSession={userSession}
          />
        )}
        {followType === FollowType.Following && (
          <FollowingAll
            followingDids={followingDids}
            onClose={onClose}
            editable={editable}
            setFollowingDids={setFollowingDids}
            userSession={userSession}
          />
        )}
        {followType === FollowType.MutualFollower && (
          <MutualFollowerAll
            mutualDids={mutualDids}
            onClose={onClose}
            editable={editable}
            setFollowingDids={setFollowingDids}
            userSession={userSession}
          />
        )}
      </div>
    </div>
  </div>
);

export default ViewAllFollowModal;
