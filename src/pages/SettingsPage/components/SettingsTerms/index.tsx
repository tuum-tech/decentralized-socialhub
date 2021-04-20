import React from 'react';
import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonContent
} from '@ionic/react';
import style from './style.module.scss';
import Content from 'src/pages/TermsPage/components/Content';

const SettingsTerms: React.FC = () => {
  return (
    <IonContent className={style['settingsterms']}>
      <IonGrid className={style['tab-grid']}>
        <IonRow>
          <IonCol>
            <IonCard className={style['tab-card']}>
              <IonCardHeader>
                <IonCardTitle className={style['card-title']}>
                  Terms of Use
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <Content />
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default SettingsTerms;
