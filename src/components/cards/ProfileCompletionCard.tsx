import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import style from './ProfileCompletionCard.module.scss';

interface Props {
  title?: string;
  progressbar?: boolean;
}

const ProfileCompletionCard: React.FC<Props> = ({ title, progressbar }) => {
  return (
    <IonCard className={style['profile-completion']}>
      <IonCardHeader>
        <IonCardTitle className={style['card-title']}>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <div className={style['badge-item']}>
          <span className={style['badge-bg']}></span>
          <span className={style['card-link']}>100% Complete</span>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default ProfileCompletionCard;
