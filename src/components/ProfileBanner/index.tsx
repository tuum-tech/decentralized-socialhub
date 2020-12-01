import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';
import banner from '../../theme/images/banner.jpg'
import style from './style.module.scss';

const ProfileBanner: React.FC = () => {
  return (
    <img src={banner} className={style["banner"]} />
  )
};

export default ProfileBanner;
