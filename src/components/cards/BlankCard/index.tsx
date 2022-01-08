import React from 'react';
import { IonCard, IonCardContent, IonRow, IonImg, IonText } from '@ionic/react';
import style from './BlankCard.module.scss';
import WhoKnows from 'src/assets/icon/who-knows.svg';
const BlankCard = () => {
  return (
    <IonCard className={style['blank-card']}>
      <IonCardContent className={style['card-content']}>
        <IonRow>
          <IonImg src={WhoKnows}></IonImg>
        </IonRow>
        <IonRow>
          <IonText>
            <h3>Welcome to Profile Spaces</h3>
          </IonText>
        </IonRow>
        <IonRow>
          <IonText>
            <h4>
              Connect with your favorite communities and individuals<br></br>
              across the Web3 ecosystem
            </h4>
          </IonText>
        </IonRow>
      </IonCardContent>
    </IonCard>
  );
};

export default BlankCard;
