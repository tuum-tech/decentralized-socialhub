import React from 'react';
import { IonContent } from '@ionic/react';

import style from './style.module.scss';

const Logo: React.FC = () => {
  return (
    <IonContent className={style['logo']}>
      <div>
        <img src="../../assets/logo_profile_black.svg" />
      </div>
    </IonContent>
  );
};

export default Logo;
