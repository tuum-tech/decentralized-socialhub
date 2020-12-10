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
    <div className={style["pagesList"]}>
      {/*-- Default FollowingList --*/}

      <h1>Pages</h1>
      <IonGrid>
        <IonRow>
          <IonCol size="2"><img className={style["thumbnail"]} src={charles} /></IonCol>
          <IonCol size="10"><span className={style["name"]}>Charles Hoskinson</span></IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="2"><img className={style["thumbnail"]} src={vitalik} /></IonCol>
          <IonCol size="10"><span className={style["name"]}>Vitalik Buterin</span></IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="2"><img className={style["thumbnail"]} src={pomp} /></IonCol>
          <IonCol size="10"><span className={style["name"]}>Anthony Pompliano</span></IonCol>
        </IonRow>
      </IonGrid>

    </div >
  )
};

export default FollowingList;
