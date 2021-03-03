import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React from 'react';

import { ExperienceItem, ProfileDTO } from 'src/pages/PublicPage/types';
import AboutCard from '../cards/AboutCard';
import EducationCard from '../cards/EducationCard';
import ExperienceCard from '../cards/ExperienceCard';
import OverviewCard from '../cards/OverviewCard';
import DashboardNav from '../DashboardNav';
import FollowersWidget from '../FollowersWidget';
import FollowingList from '../FollowingList';

import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';
import PublicProfileNav from '../PublicProfileNav';
import SocialProfiles from '../SocialProfiles';
import style from './style.module.scss';

interface IProps {
  profile: ProfileDTO;
}

const AboutSection: React.FC<IProps> = ({ profile }: IProps) => {

  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol>
          <AboutCard basicDTO={profile.basicDTO} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};


const ExperienceSection: React.FC<IProps> = ({ profile }: IProps) => {

  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol>
          <ExperienceCard experiences={profile.experienceDTO} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const EducationSection: React.FC<IProps> = ({ profile }: IProps) => {

  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol>
          <EducationCard educationDTO={profile.educationDTO} updateFunc={() => { }} mode="readonly" />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const CerificationsSection: React.FC = () => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol>
          <OverviewCard />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const AchievementsSection: React.FC = () => {
  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol>
          <OverviewCard />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

const ProfileComponent: React.FC<IProps> = ({ profile }: IProps) => {
  return (
    <>
      <IonGrid className={style['fixed']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9" className="ion-no-padding"><ProfileBanner /></IonCol>
          <IonCol size="9" className="ion-no-padding"><ProfileHeader profile={profile} /></IonCol>
          <IonCol size="9" className="ion-no-padding"><PublicProfileNav profile={profile} /></IonCol>
        </IonRow>
      </IonGrid >

      <IonGrid className={style['scroll']}>
        <IonRow>
          <IonCol size="9">
            <AboutSection profile={profile} />
            <ExperienceSection profile={profile} />
            <EducationSection profile={profile} />
            <CerificationsSection />
            <AchievementsSection />
          </IonCol>
          <IonCol size="3">

            <SocialProfiles />
            <FollowingList did={profile.basicDTO.did} />
            <FollowersWidget />
          </IonCol>
        </IonRow >
      </IonGrid >
    </>

  );
};

export default ProfileComponent;
