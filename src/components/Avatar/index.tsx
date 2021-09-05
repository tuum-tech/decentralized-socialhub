import React, { useEffect, useState } from 'react';

import {
  getAvatarIfno,
  AvatarInterface,
  defaultAvatar
} from 'src/utils/avatar';
import DefaultAvatar from './DefaultAvatar';
import ImgAvatar from './ImgAvatar';

interface AvatarProps {
  did: string;
  width?: string;
  ready?: boolean;
}

const Avatar: React.FC<AvatarProps> = ({
  did = '',
  width = '86px',
  ready = false
}: AvatarProps) => {
  const [avatarInfo, setAvatarInfo] = useState<AvatarInterface>(defaultAvatar);

  useEffect(() => {
    (async () => {
      const avatarRes = await getAvatarIfno(did);
      if (avatarRes) setAvatarInfo(avatarRes);
    })();
  }, [did]);

  if (avatarInfo.type === 'default') {
    return (
      <DefaultAvatar
        name={avatarInfo.name}
        ready={ready}
        didPublished={avatarInfo.didPublished}
      />
    );
  }

  return (
    <ImgAvatar
      ready={ready}
      didPublished={avatarInfo.didPublished}
      img={avatarInfo.avatar}
    />
  );
};

export default Avatar;
