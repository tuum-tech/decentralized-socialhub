import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import style from './OverviewCard.module.scss';

const OverviewCard: React.FC = () => {
  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
        <IonCardTitle>Overview</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Keep close to Nature's heart... and break clear away, once in awhile,
        and climb a mountain or spend a week in the woods. Wash your spirit
        clean.
      </IonCardContent>
    </IonCard>
  );
};

export default OverviewCard;
