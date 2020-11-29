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
import charles from '../../theme/images/charles.jpeg'
import vitalik from '../../theme/images/vitalik.jpeg'
import pomp from '../../theme/images/pomp.jpg'
import { Link } from 'react-router-dom';

const FollowingList: React.FC = () => {
  return (
    <IonContent className={style["followinglist"]}>
      {/*-- Default FollowingList --*/}

      <IonCard>
        <IonCardTitle><h1>Following (10)</h1></IonCardTitle>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              <IonCol size="3"><img className={style["thumbnail"]} src={charles} /></IonCol>
              <IonCol size="9"><span className={style["name"]}>Charles Hoskinson</span></IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3"><img className={style["thumbnail"]} src={vitalik} /></IonCol>
              <IonCol size="9">Vitalik Buterin</IonCol>
            </IonRow>
            <IonRow>
              <IonCol size="3"><img className={style["thumbnail"]} src={pomp} /></IonCol>
              <IonCol size="9">Anthony Pompliano</IonCol>
            </IonRow>
          </IonGrid>
          <span className={style["invite"]}>+ Invite friends to join</span>
        </IonCardContent>
      </IonCard>

    </IonContent >
  )
};

export default FollowingList;
