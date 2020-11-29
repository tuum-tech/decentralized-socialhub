import React from 'react';
import { IonSpinner, IonCard, IonContent, IonGrid, IonCardTitle, IonCardContent } from '@ionic/react';
import style from './style.module.scss';

const ProfileCompletion: React.FC = () => {
  return (
    <IonContent className={style["profilecompletion"]}>
      {/*-- Default ProfileCompletion --*/}
      <IonCard>
        <IonCardTitle><h1>Profile Completion</h1></IonCardTitle>
        <IonCardContent></IonCardContent>
      </IonCard>
    </IonContent >
  )
};

export default ProfileCompletion;
