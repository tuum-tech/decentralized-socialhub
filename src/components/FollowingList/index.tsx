import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonSpinner,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import style from './style.module.scss';


const FollowingList: React.FC = () => {
  return (
    <IonContent className={style["followinglist"]}>
      {/*-- Default FollowingList --*/}

      <IonCard>
        <IonCardTitle><h1>Following (10)</h1></IonCardTitle>
        <IonCardContent>
          <ul>
            <li>User 1</li>
            <li>User 1</li>
            <li>User 1</li>
            <li>User 1</li>
          </ul>
        </IonCardContent>
      </IonCard>

    </IonContent>
  )
};

export default FollowingList;
