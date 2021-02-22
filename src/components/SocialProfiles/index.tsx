import React from 'react';
import { IonSpinner, IonContent, IonCardHeader, IonCardTitle, IonCard, IonCardContent } from '@ionic/react';
import style from '../cards/WidgetCards.module.scss';

const SocialProfiles: React.FC = () => {
  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        <IonCardTitle>Social Profiles</IonCardTitle>

      </IonCardHeader>

      <IonCardContent>Not implemented</IonCardContent>
    </IonCard>

  )
};

export default SocialProfiles;
