import React from 'react';
import { IonContent, IonGrid, IonRow } from '@ionic/react';
import ProfileName from '../../profile/ProfileName';

import style from './style.module.scss';

const PageHeader: React.FC = () => {
  return (
    <IonContent className={style['pageheader']}>
      <IonGrid>
        <IonRow>
          <ProfileName className={style['headertext']}>Settings</ProfileName>
        </IonRow>
        <IonRow className={style['subheadertext']}>Account</IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default PageHeader;
