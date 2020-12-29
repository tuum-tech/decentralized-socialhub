import React from 'react';
import { IonContent, IonImg } from '@ionic/react';
import style from './style.module.scss';

const Logo: React.FC = () => {
  return (
    <IonContent className={style["logo"]}>
      <div>
        <img src="../../assets/logo_profile.svg" />
      </div>
    </IonContent>
  )
};

export default Logo;