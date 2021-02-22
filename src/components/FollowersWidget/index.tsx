import React from 'react';
import { IonSpinner, IonContent, IonCard, IonCardTitle, IonCardContent, IonCardHeader } from '@ionic/react';
import styled from 'styled-components';
import style from '../cards/WidgetCards.module.scss';


const FollowersWidget: React.FC = () => {
  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        <IonCardTitle>Followers</IonCardTitle>

      </IonCardHeader>

      <IonCardContent>ebdiqw</IonCardContent>
    </IonCard>
  )
};

export default FollowersWidget;