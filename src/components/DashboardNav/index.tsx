import React, { useState } from 'react';
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonContent,
  IonSpinner,
  IonList,
  IonLabel,
  IonItem,
  IonCol,
  IonGrid,
  IonRow,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
  IonButton,
} from '@ionic/react';
import style from './style.module.scss';
import SpotlightCard from 'src/elements/cards/SpotlightCard';
import BadgesCard from 'src/elements/cards/BadgesCard';
import OverviewCard from 'src/elements/cards/OverviewCard';
import ButtonWhite from 'src/elements/buttons/ButtonWhite';

const DashboardHome: React.FC = () => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size='4'>
          <SpotlightCard
            title='Welcome to Profile'
            content='To get you familiar with the platform you can start our tutorial which
        will go through some basics. You will receive a badge for completing it.'
            component={<ButtonWhite>Start beginners tutorial</ButtonWhite>}
          />
          <BadgesCard title='Badges' />
        </IonCol>
        <IonCol size='8'>
          <OverviewCard />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const DashboardStatus: React.FC = () => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size='4'>
          <SpotlightCard
            title='Overview'
            content='Your profile is ready. There are no pending transactions.'
          />
        </IonCol>
        <IonCol size='8'>
          <OverviewCard />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const DashboardBadges: React.FC = () => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size='4'>
          <SpotlightCard
            title='Overview'
            content='You gain badges the more you complete and use your profile. Level your profile up! Click on a badge to learn more about it.'
          />
          <BadgesCard title='Social' />
        </IonCol>
        <IonCol size='8'>
          <OverviewCard />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const DashboardNav: React.FC = () => {
  const [active, setActive] = useState('home');

  return (
    <IonContent className={style['dashboardnav']}>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active == 'home' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('home')}
        >
          <IonLabel className={style['tab-label']}>Home</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'status' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('status')}
        >
          <IonLabel className={style['tab-label']}>Status</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active == 'badges' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('badges')}
        >
          <IonLabel className={style['tab-label']}>Badges</IonLabel>
        </IonItem>
      </IonList>
      {active == 'home' && <DashboardHome />}
      {active == 'status' && <DashboardStatus />}
      {active == 'badges' && <DashboardBadges />}
    </IonContent>
  );
};

export default DashboardNav;
