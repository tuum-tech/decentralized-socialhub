import React, { useState } from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonIcon
} from '@ionic/react';
import styled from 'styled-components';
import SettingsHeader from '../SettingsHeader/Loadable';
import SettingsAccount from '../SettingsAccount/Loadable';
import SettingsTerms from '../SettingsTerms/Loadable';
import SettingsSubscription from '../SettingsSubscription/Loadable';
import SettingsLearn from '../SettingsLearn/Loadable';
import SettingsReport from '../SettingsReport/Loadable';
import SettingsContact from '../SettingsContact/Loadable';

import style from './style.module.scss';
import { chevronDownOutline, chevronUpOutline } from 'ionicons/icons';

interface Props {
  tab?: string;
  useSession: ISessionItem;
}

const SettingsBody: React.FC<Props> = ({
  tab = 'settingsaccount',
  useSession
}) => {
  const [active, setActive] = useState(tab);
  const [hCollapse, setHelpCollapse] = useState(false);

  return (
    <>
      <SettingsHeader />
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
                      active === 'settingslearn' ||
                      active === 'settingscontact' ||
                      active === 'settingsreport'
                        ? style['item-active']
                        : style['item-link']
                    }
                    onClick={() => {
                      setHelpCollapse(!hCollapse);
                    }}
                  >
                    <IonLabel>
                      <h3>Help & Support</h3>
                    </IonLabel>
                    <CustomIcon
                      slot="end"
                      icon={hCollapse ? chevronDownOutline : chevronUpOutline}
                    ></CustomIcon>
                  </IonItem>
                  {hCollapse && (
                    <SubMenu>
                      <IonList>
                        <IonItem
                          className={
                            active === 'settingslearn'
                              ? style['item-active']
                              : style['item-link']
                          }
                          onClick={() => {
                            setActive('settingslearn');
                          }}
                        >
                          <IonLabel>
                            <h3>Learn about Profile</h3>
                          </IonLabel>
                        </IonItem>
                        <IonItem
                          className={
                            active === 'settingscontact'
                              ? style['item-active']
                              : style['item-link']
                          }
                          onClick={() => {
                            setActive('settingscontact');
                          }}
                        >
                          <IonLabel>
                            <h3>Contact Us</h3>
                          </IonLabel>
                        </IonItem>
                        <IonItem
                          className={
                            active === 'settingsreport'
                              ? style['item-active']
                              : style['item-link']
                          }
                          onClick={() => {
                            setActive('settingsreport');
                          }}
                        >
                          <IonLabel>
                            <h3>Report a problem</h3>
                          </IonLabel>
                        </IonItem>
                      </IonList>
                    </SubMenu>
                  )}
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
              {/* {active === 'settingshelp' && <SettingsHelp />} */}
              {active === 'settingssubscription' && <SettingsSubscription />}
              {active === 'settingslearn' && <SettingsLearn />}
              {active === 'settingscontact' && (
                <SettingsContact useSession={useSession} />
              )}
              {active === 'settingsreport' && (
                <SettingsReport useSession={useSession} />
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </>
  );
};

const CustomIcon = styled(IonIcon)`
  font-size: 15px;
`;
const SubMenu = styled(IonItem)`
  --border-color: #ffffff;
  padding: 0;
`;

export default SettingsBody;
