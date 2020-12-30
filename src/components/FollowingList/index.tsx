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
import verified from '../../assets/verified.svg'
import { Link } from 'react-router-dom';

const FollowingList: React.FC = () => {
  return (
    <div className={style["followinglist"]}>
      {/*-- Default FollowingList --*/}

      <h1>Following (10)</h1>
      <IonGrid>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={charles} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Charles Hoskinson</span><img src={verified} className={style["verified"]} /></div>
            <div><span className={style["number-followers"]}>100K followers</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={vitalik} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Vitalik Buterin</span><img src={verified} className={style["verified"]} /></div>
            <div><span className={style["number-followers"]}>2M followers</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={pomp} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Anthony Pompliano</span></div>
            <div><span className={style["number-followers"]}>550K followers</span></div>
          </IonCol>
        </IonRow>
      </IonGrid>
      <span className={style["invite"]}>+ Invite friends to join</span>



    </div>
  )
};

export default FollowingList;
