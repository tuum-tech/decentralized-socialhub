import React from 'react';

import style from './style.module.scss';

interface AvatarProps {
  ready: boolean;
  didPublished: boolean;
  img: string;
}

const ImgAvatar: React.FC<AvatarProps> = ({
  ready,
  didPublished,
  img
}: AvatarProps) => {
  const cn = ready
    ? style['border-primary']
    : didPublished
    ? style['border-primary']
    : style['border-danger'];
  return (
    <div className={style['avatar']}>
      <img src={img} className={cn} alt="avatar" />
    </div>
  );
};

export default ImgAvatar;
