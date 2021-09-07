import React, { useEffect, useState } from 'react';

import { getAvatarInfo, GetAvatarRes } from 'src/utils/avatar';
import defaultAvatar from '../../assets/icon/dp.png';
import style from './style.module.scss';

interface AvatarProps {
  did: string;
  didPublished?: boolean;
  width?: string;
  ready?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  did = '',
  didPublished = false,
  width = '86px',
  ready = false
}: AvatarProps) => {
  const [avatarInfo, setAvatarInfo] = useState<GetAvatarRes>({
    avatar: defaultAvatar,
    didPublished: true
  });

  useEffect(() => {
    (async () => {
      const avatarRes = await getAvatarInfo(did);
      if (avatarRes && avatarRes.avatar) {
        setAvatarInfo(avatarRes);
      }
    })();
  }, [did]);
  return (
    <div className={style['avatar']}>
      <img
        src={avatarInfo.avatar}
        className={
          ready
            ? style['border-primary']
            : avatarInfo.didPublished || didPublished
            ? style['border-primary']
            : style['border-danger']
        }
        style={{ maxWidth: width }}
        height="auto"
        alt="avatar"
      />
    </div>
  );
};

export default Avatar;
