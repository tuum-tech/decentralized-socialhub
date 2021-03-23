import React, { useState } from 'react';
import { IonContent, IonList, IonLabel, IonItem } from '@ionic/react';

import DashboardHome from '../Home';
import DashboardStatus from '../Status';
import DashboardBadges from '../Badges';

import style from './style.module.scss';

export interface DashboardProps {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
}

const DashboardContent: React.FC<DashboardProps> = ({
  onTutorialStart,
  profile,
  sessionItem
}) => {
  const [active, setActive] = useState('home');

  return (
    <IonContent className={style['dashboardcontent']}>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active === 'home' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('home')}
        >
          <IonLabel className={style['tab-label']}>Home</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'status' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('status')}
        >
          <IonLabel className={style['tab-label']}>Status</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'badges' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('badges')}
        >
          <IonLabel className={style['tab-label']}>Badges</IonLabel>
        </IonItem>
      </IonList>
      {active === 'home' && (
        <DashboardHome
          sessionItem={sessionItem}
          profile={profile}
          onTutorialStart={onTutorialStart}
        />
      )}
      {active === 'status' && <DashboardStatus />}
      {active === 'badges' && <DashboardBadges />}
    </IonContent>
  );
};

export default DashboardContent;
