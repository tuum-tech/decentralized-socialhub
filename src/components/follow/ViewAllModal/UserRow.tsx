import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import { FollowButton } from 'src/components/buttons';

import style from './style.module.scss';

interface Props {
  name: string;
  did: string;
  isFollowing?: boolean;
  followAction: () => void;
}
const UserRow = ({ name, did, isFollowing, followAction }: Props) => {
  return (
    <div className={style['userRow']}>
      <Avatar did={did} width="50px" />
      <div className={style['userRow_info']}>
        <Link to={'/did' + did}>
          <span className={style['name']}>{name}</span>
          <br />
          <span className={style['truncatedDID']}>{did}</span>
        </Link>
      </div>
      <FollowButton onClick={() => {}} width={100}>
        Follow
      </FollowButton>
    </div>
  );
};

export default UserRow;
