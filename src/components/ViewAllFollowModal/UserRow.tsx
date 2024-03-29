import React from 'react';
import { Link } from 'react-router-dom';

import Avatar from 'src/components/Avatar';
import { FollowButton } from 'src/elements/buttons';
import { getDIDString } from 'src/utils/did';

import style from './style.module.scss';

interface Props {
  name: string;
  did: string;
  text: string;
  followAction: () => void;
  disabled?: boolean;
}
const UserRow = ({
  name,
  did,
  text,
  followAction,
  disabled = false
}: Props) => {
  return (
    <div className={style['userRow']}>
      <Avatar did={did} width="50px" />
      <div className={style['userRow_info']}>
        <Link to={getDIDString('/did/' + did)}>
          <span className={style['name']}>{name}</span>
          <br />
          <span className={style['truncatedDID']}>{did}</span>
        </Link>
      </div>
      <FollowButton
        disabled={disabled}
        onClick={followAction}
        width={100}
        height={35}
      >
        {text}
      </FollowButton>
    </div>
  );
};

export default UserRow;
