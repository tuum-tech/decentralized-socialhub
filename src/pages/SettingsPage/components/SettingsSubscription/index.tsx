import React from 'react';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonRow
} from '@ionic/react';
import style from './style.module.scss';

const SettingsSubscription: React.FC = () => {
  return (
    <div className={style['settingssubscription']}>
      <IonRow>
        <IonCol>
          <IonCard className={style['tab-card']}>
            <IonCardHeader>
              <IonCardTitle className={style['card-title']}>
                Subscription &amp; payments
              </IonCardTitle>
            </IonCardHeader>
          </IonCard>
        </IonCol>
      </IonRow>
    </div>
  );
};

export default SettingsSubscription;
