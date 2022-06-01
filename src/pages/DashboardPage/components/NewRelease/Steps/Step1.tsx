import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import style from '../style.module.scss';

const Step1Component: React.FC = () => {
  return (
    <IonGrid className="ion-no-padding">
      <IonRow className={style['item']}>
        <IonCol size="auto" className="ion-no-padding">
          <p>1.</p>
        </IonCol>
        <IonCol size="auto" className="ion-no-padding">
          <p className={style['item-left']}>
            NFT Introduced: Now showcase your NFTs under your profile.
          </p>
        </IonCol>
      </IonRow>
      <IonRow className={style['item']}>
        <IonCol size="auto" className="ion-no-padding">
          <p>2.</p>
        </IonCol>
        <IonCol size="auto" className="ion-no-padding">
          <p className={style['item-left']}>
            Automatically select a portion of your image as you hover over it
            and click.
            <br />
            Saves time while making complex edits and delivers faster results.
          </p>
        </IonCol>
      </IonRow>
      <IonRow className={style['item']}>
        <IonCol size="auto" className="ion-no-padding">
          <p>3.</p>
        </IonCol>
        <IonCol size="auto" className="ion-no-padding">
          <p className={style['item-left']}>
            Import playable Lottie animations right into your prototype for
            lifelike motion
          </p>
        </IonCol>
      </IonRow>
      <IonRow className={style['item']}>
        <IonCol size="auto" className="ion-no-padding">
          <p>4.</p>
        </IonCol>
        <IonCol size="auto" className="ion-no-padding">
          <p className={style['item-left']}>
            Fine-tune the size and quality of your images with enhanced export
            controls.
          </p>
        </IonCol>
      </IonRow>
      <IonRow className={style['item']}>
        <IonCol size="auto" className="ion-no-padding">
          <p>5.</p>
        </IonCol>
        <IonCol size="auto" className="ion-no-padding">
          <p className={style['item-left']}>
            Runs natively on Apple Silicon devices. Experience faster load
            times, smoother navigation, and quick rendering.
          </p>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Step1Component;
