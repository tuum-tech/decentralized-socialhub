import React from 'react';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonContent
} from '@ionic/react';

import style from './style.module.scss';

const SettingsHelp: React.FC = () => {
  return (
    <IonContent className={style['settingshelp']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <IonCardTitle className={style['card-title']}>
                  Help &amp; Support
                </IonCardTitle>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsHelp;
