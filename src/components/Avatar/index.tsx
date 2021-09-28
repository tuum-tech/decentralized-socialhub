import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  getAvatarIfno,
  AvatarInterface,
  defaultAvatar
} from 'src/utils/avatar';

import style from './style.module.scss';
interface AvatarProps {
  did: string;
  didPublished?: boolean;
  width?: string;
  ready?: boolean;
  fromDid?: boolean;
}

const ContentDiv = styled.div`
  min-width: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f8fa;
  color: #7a7a9d;
  font-weight: bold;
`;

const Avatar: React.FC<AvatarProps> = ({
  did = '',
  didPublished = false,
  width = '86px',
  ready = false,
  fromDid = false
}: AvatarProps) => {
  const [avatarInfo, setAvatarInfo] = useState<AvatarInterface>(defaultAvatar);

  useEffect(() => {
    (async () => {
      const avatarRes = await getAvatarIfno(did, fromDid);
      console.log('===>avatarRes', avatarRes);
      if (avatarRes) setAvatarInfo(avatarRes);
    })();
  }, [did, fromDid]);

  const cn = ready
    ? style['border-primary']
    : avatarInfo.didPublished || didPublished
    ? style['border-primary']
    : style['border-danger'];

  if (avatarInfo.type === 'default') {
    return (
      <div className={style['avatar']} style={{ height: width, width }}>
        <ContentDiv className={cn}>
          {avatarInfo.name[0]} {avatarInfo.name[1]}
        </ContentDiv>
      </div>
    );
  }

  return (
    <div className={style['avatar']} style={{ height: width, width }}>
      <img src={avatarInfo.avatar} className={cn} height="auto" alt="avatar" />
    </div>
  );
};

export default Avatar;
