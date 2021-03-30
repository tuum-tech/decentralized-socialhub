import React from 'react';
import styled from 'styled-components';

import SkeletonAvatar from './SkeletonAvatar';
import style from './style.module.scss';

export const AvatarBox = styled.div`
  margin-left: 50px;
  margin-top: 15px
  margin-bottom: 15px;
`;

interface AvatarProps {
  avatar: string;
  mode: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatar, mode }: AvatarProps) => {
  return (
    <>
      <SkeletonAvatar />
      <img
        alt="avatar"
        src={avatar}
        width={mode === 'small' ? '44' : '80'}
        height={mode === 'small' ? '44' : '80'}
        className={style['clip-avatar-svg']}
      />
    </>
  );
};

export default Avatar;
