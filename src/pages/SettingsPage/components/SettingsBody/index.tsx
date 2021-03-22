import React, { useState } from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import PageHeader from 'src/components/layouts/PageHeader';
import SettingsAccount from '../SettingsAccount/Loadable';
import SettingsTerms from '../SettingsTerms/Loadable';
import SettingsHelp from '../SettingsHelp/Loadable';
import SettingsSubscription from '../SettingsSubscription/Loadable';

import style from './style.module.scss';

interface Props {
  tab?: string;
}

const SettingsBody: React.FC<Props> = ({ tab = 'settingsaccount' }) => {
  const [active, setActive] = useState(tab);

  return (
    <>
      <PageHeader />
      <IonContent className={style['settingsbody']}>
        <IonGrid className={style['settingspagegrid']}>
          <IonRow className={style['settingscontent']}>
            <IonCol size="2" className={style['left-panel']}>
              <IonContent className={style['settingsbodynavbar']}>
                <IonList>
                  <IonItem
                    className={
                      active === 'settingsaccount'
                        ? style['item-active']
                        : style['item-link']
                    }
                    onClick={() => {
                      setActive('settingsaccount');
                    }}
                  >
                    <IonLabel>
                      <h3>Account</h3>
                    </IonLabel>
                  </IonItem>
                  <IonItem
                    className={
                      active === 'settingsterms'
                        ? style['item-active']
                        : style['item-link']
                    }
                    onClick={() => {
                      setActive('settingsterms');
                    }}
                  >
                    <IonLabel>
                      <h3>Terms of Use</h3>
                    </IonLabel>
                  </IonItem>
                  <IonItem
                    className={
                      active === 'settingshelp'
                        ? style['item-active']
                        : style['item-link']
                    }
                    onClick={() => {
                      setActive('settingshelp');
                    }}
                  >
                    <IonLabel>
                      <h3>Help & Support</h3>
                    </IonLabel>
                  </IonItem>
                  <IonItem
                    className={
                      active === 'settingssubscription'
                        ? style['item-active']
                        : style['item-link']
                    }
                    onClick={() => {
                      setActive('settingssubscription');
                    }}
                  >
                    <IonLabel>
                      <h3>Subscription & Payments</h3>
                    </IonLabel>
                  </IonItem>
                </IonList>
              </IonContent>
            </IonCol>
            <IonCol size="10" className={style['right-panel']}>
              {active === 'settingsaccount' && <SettingsAccount />}
              {active === 'settingsterms' && <SettingsTerms />}
              {active === 'settingshelp' && <SettingsHelp />}
              {active === 'settingssubscription' && <SettingsSubscription />}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

export default SettingsBody;
