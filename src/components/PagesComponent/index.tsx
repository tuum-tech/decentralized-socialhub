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
import tuum from '../../assets/tuum.png';
import intel from '../../assets/intel.png';
import ibm from '../../assets/ibm.png';
import { Link } from 'react-router-dom';

const FollowingList: React.FC = () => {
  return (
    <div className={style["pagesList"]}>
      {/*-- Default FollowingList --*/}

      <h1>Pages</h1>
      <IonGrid>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={tuum} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Tuum Tech</span></div>
            <div><span className={style["number-followers"]}>50M followers</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={intel} /></IonCol>
          <IonCol size="10">
            <div><span className={style["name"]}>Intel Corporation</span></div>
            <div><span className={style["number-followers"]}>119K followers</span></div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="*"><img className={style["thumbnail"]} src={ibm} /></IonCol>
          <IonCol size="10">
            <span className={style["name"]}>IBM Technologies</span>
            <div><span className={style["number-followers"]}>119K followers</span></div>
          </IonCol>
        </IonRow>
      </IonGrid>
      <span className={style["explore"]}>Explore all</span>
    </div >
  )
};

export default FollowingList;
