import React, { useEffect, useState } from 'react';

import { getAvatarIfno, GetAvatarRes } from 'src/utils/avatar';
import defaultAvatar from '../../assets/dp.jpeg';
import style from './style.module.scss';

interface AvatarProps {
  size?: string;
  did: string;
}

const Avatar: React.FC<AvatarProps> = ({ size, did = '' }: AvatarProps) => {
  const [avatarInfo, setAvatarInfo] = useState<GetAvatarRes>({
    avatar: defaultAvatar,
    didPublished: true
  });

  useEffect(() => {
    (async () => {
      const avatarRes = await getAvatarIfno(did);
      if (avatarRes && avatarRes.avatar) {
        setAvatarInfo(avatarRes);
      }
    })();
  }, []);
  return (
    <div className={style['avatar']}>
      <img
        src={avatarInfo.avatar}
        className={
          avatarInfo.didPublished
            ? style['border-primary']
            : style['border-danger']
        }
        alt="avatar"
      />
    </div>
  );
};

export default Avatar;
