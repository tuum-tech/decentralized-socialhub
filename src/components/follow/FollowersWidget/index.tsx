import React from 'react';
import {
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader
} from '@ionic/react';

import style from '../../cards/WidgetCards.module.scss';

const FollowersWidget: React.FC = () => {
  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        <IonCardTitle>Followers</IonCardTitle>
      </IonCardHeader>

      <IonCardContent></IonCardContent>
    </IonCard>
  );
};

export default FollowersWidget;
