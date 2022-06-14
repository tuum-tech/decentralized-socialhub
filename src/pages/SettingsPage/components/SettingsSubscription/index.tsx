import React from 'react';
import { IonCard, IonCardHeader, IonCardTitle } from '@ionic/react';
import style from './style.module.scss';

const SettingsSubscription: React.FC = () => {
  return (
    <div className={style['settingssubscription']}>
      <IonCard className={style['tab-card']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>
            Subscription &amp; payments
          </IonCardTitle>
        </IonCardHeader>
      </IonCard>
    </div>
  );
};

export default SettingsSubscription;
