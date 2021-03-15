import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList
} from '@ionic/react';
import style from './BadgesCard.module.scss';

interface Props {
  title?: string;
  progressbar?: boolean;
}

const BadgesCard: React.FC<Props> = ({ title, progressbar }) => {
  return (
    <IonCard className={style['badges']}>
      <IonCardHeader>
        <IonCardTitle className={style['card-title']}>
          {title} <span className={style['card-link']}>Explore All</span>
        </IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Complete tasks and gain badges.
        <IonList>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            LinkedIn Verification
            <span className={style['card-link']}>Start</span>
          </IonItem>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            Twitter Verification
            <span className={style['card-link']}>Start</span>
          </IonItem>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            Beginners Tutorial
            <span className={style['card-link']}>Start</span>
          </IonItem>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            Add Basic<span className={style['card-link']}>Start</span>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default BadgesCard;
