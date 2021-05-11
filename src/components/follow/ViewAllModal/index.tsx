import React, { useEffect, useState } from 'react';

import UserRow from './UserRow';
import style from './style.module.scss';

import { loadFollowingUsers, loadFollowerUsers } from 'src/utils/follow';

interface Props {
  isFollower: boolean;
  targetDid: string;
}
const ViewAllModal = ({ targetDid, isFollower }: Props) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let _users = [];
      if (isFollower) {
        _users = await loadFollowerUsers(targetDid);
      } else {
        _users = await loadFollowingUsers(targetDid);
      }
      setUsers(_users);
    })();
  }, [targetDid, isFollower]);

  const title = `${isFollower ? 'Followers' : 'Followings'} (${users.length})`;
  console.log('=====>', targetDid, users);
  return (
    <div className={style['modal']}>
      <div className={style['modal_container']}>
        <div className={style['modal_content']}>
          <p className={style['modal_title']}>{title}</p>
          {users.length > 0 &&
            users.map((user: any) => (
              <UserRow
                did={user.did}
                name={user.name}
                isFollowing={isFollower}
                followAction={() => {}}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default ViewAllModal;
