import React from 'react';
import banner from '../../assets/banner.png';
import style from './style.module.scss';

const ProfileBanner: React.FC = () => {
  return <img src={banner} className={style['banner']} alt='banner' />;
};

export default ProfileBanner;
