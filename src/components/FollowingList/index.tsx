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


const FollowingList: React.FC = () => {
  return (
    <IonContent className={"followinglist"}>
      {/*-- Default FollowingList --*/}

      <IonCard>
        <IonCardTitle>Following</IonCardTitle>
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
