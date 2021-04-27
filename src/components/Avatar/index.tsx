import React, { useEffect, useState } from 'react';

import { getAvatarIfno, GetAvatarRes } from 'src/utils/avatar';
import defaultAvatar from '../../assets/dp.jpeg';
import style from './style.module.scss';

interface AvatarProps {
  did: string;
  width?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  did = '',
  width = '86px'
}: AvatarProps) => {
  const [avatarInfo, setAvatarInfo] = useState<GetAvatarRes>({
    avatar: defaultAvatar,
    didPublished: true
  });

  useEffect(() => {
    (async () => {
      if (did) {
        const avatarRes = await getAvatarIfno(did);
        if (avatarRes && avatarRes.avatar) {
          setAvatarInfo(avatarRes);
        }
      }
    })();
  }, [did]);
  return (
    <div className={style['avatar']}>
      <img
        src={avatarInfo.avatar}
        className={
          avatarInfo.didPublished
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
