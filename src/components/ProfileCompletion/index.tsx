import React from 'react';
import { IonSpinner, IonCard, IonContent, IonGrid, IonCardTitle, IonCardContent, IonProgressBar, IonRow, IonCol } from '@ionic/react';
import style from './style.module.scss';
import check from '../../theme/images/checkmark-circle-outline.svg'
import checkgreen from '../../assets/check-circle-fill.svg'

const ProfileCompletion: React.FC = () => {
  return (
    <div className={style["profilecompletion"]}>
      {/*-- Default ProfileCompletion --*/}
      <h1>Profile Completion</h1>
      <IonGrid>
        <IonRow>
          <IonCol size="7">
            <IonProgressBar value={0.78}>

            </IonProgressBar>
          </IonCol>
          <IonCol size="5">
            <span>78% complete</span>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="auto">
            <img src={check} />
          </IonCol>
          <IonCol size="auto">
            <span>Complete your profile</span>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="auto">
            <img src={check} />
          </IonCol>
          <IonCol size="auto">
            <span>Publish your profile</span>
          </IonCol>
        </IonRow>
        <IonRow className={style["green"]}>
          <IonCol size="auto">
            <img src={checkgreen} />
          </IonCol>
          <IonCol size="auto">
            <span>Add Profile Photo</span>
          </IonCol>
        </IonRow>
        <IonRow className={style["green"]}>
          <IonCol size="auto">
            <img src={checkgreen} />
          </IonCol>
          <IonCol size="auto">
            <span>Add 1 Educational Record</span>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="auto">
            <img src={check} />
          </IonCol>
          <IonCol size="auto">
            <span>Add Summary</span>
          </IonCol>
        </IonRow>
      </IonGrid>
      <span className={style["explore"]}>Explore all</span>

    </div >
  )
};

export default ProfileCompletion;
