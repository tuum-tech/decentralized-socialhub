import React, { useState } from 'react';
import {
  IonContent,
  IonList,
  IonLabel,
  IonItem,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import style from './style.module.scss';
import SpotlightCard from 'src/components/cards/SpotlightCard';
import BadgesCard from 'src/components/cards/BadgesCard';
import OverviewCard from 'src/components/cards/OverviewCard';
import ButtonWhite from 'src/components/buttons/ButtonWhite';
import AboutCard from '../cards/AboutCard';
import ExperienceCard from '../cards/ExperienceCard';
import EducationCard from '../cards/EducationCard';
import { ProfileDTO } from 'src/pages/PublicPage/types';
import { ISessionItem } from 'src/services/user.service';
import ProfileCompletionCard from '../cards/ProfileCompletionCard';

export interface DashboardProps {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
}

const DashboardHome: React.FC<DashboardProps> = (props) => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size='8'>
          <AboutCard basicDTO={props.profile!.basicDTO} mode=''></AboutCard>
          <ExperienceCard
            experienceDTO={props.profile!.experienceDTO}
            mode=''
          ></ExperienceCard>
          <EducationCard
            educationDTO={props.profile!.educationDTO}
            mode=''
          ></EducationCard>
        </IonCol>
        <IonCol size='4'>
          <SpotlightCard
            title='Welcome to Profile'
            content='To get you familiar with the platform you can start our tutorial which
        will go through some basics. You will receive a badge for completing it.'
            component={
              <div>
                <br />{' '}
                <ButtonWhite onClick={() => props.onTutorialStart()}>
                  Start beginners tutorial
                </ButtonWhite>
              </div>
            }
          />
          <ProfileCompletionCard title='Profile Completion' />
          <BadgesCard title='Badges' />
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

const DashboardNav: React.FC<DashboardProps> = (props) => {
  const [active, setActive] = useState('home');

  return (
    <IonContent className={style['dashboardnav']}>
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
          sessionItem={props.sessionItem}
          profile={props.profile}
          onTutorialStart={props.onTutorialStart}
        />
      )}
      {active === 'status' && <DashboardStatus />}
      {active === 'badges' && <DashboardBadges />}
    </IonContent>
  );
};

export default DashboardNav;
