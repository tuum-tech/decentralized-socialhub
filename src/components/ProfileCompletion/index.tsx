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
          <IonCol size="1.5">
            <img src={check} />
          </IonCol>
          <IonCol size="10.5">
            <span>Complete your profile</span>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="1.5">
            <img src={check} />
          </IonCol>
          <IonCol size="10.5">
            <span>Publish your profile</span>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="1.5">
            <img src={checkgreen} />
          </IonCol>
          <IonCol size="10.5">
            <span>Add Profile Photo</span>
          </IonCol>
        </IonRow>
      </IonGrid>

    </div >
  )
};

export default ProfileCompletion;
