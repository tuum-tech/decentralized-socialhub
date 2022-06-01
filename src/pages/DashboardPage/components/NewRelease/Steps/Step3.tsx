import React from 'react';
import { IonCol, IonRow, IonGrid } from '@ionic/react';

import style from '../style.module.scss';

const Step3Component: React.FC = () => {
  return (
    <IonGrid className="ion-no-padding">
      <IonRow className={style['item']}>
        <IonCol size="auto" className="ion-no-padding">
          <p>1.</p>
        </IonCol>
        <IonCol size="auto" className="ion-no-padding">
          <p className={style['item-left']}>
            NFT Introduced, Now showcase your NFTs under your profile.
          </p>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Step3Component;
