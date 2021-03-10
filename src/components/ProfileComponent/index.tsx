import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React from 'react';

import { ExperienceItem, ProfileDTO } from 'src/pages/PublicPage/types';
import { ISessionItem } from 'src/services/user.service';
import AboutCard from '../cards/AboutCard';
import EducationCard from '../cards/EducationCard';
import ExperienceCard from '../cards/ExperienceCard';
import OverviewCard from '../cards/OverviewCard';
import DashboardNav from '../DashboardNav';
import FollowersWidget from '../FollowersWidget';
import FollowingList from '../FollowingList';
import LoggedHeader from '../LoggedHeader';

import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';
import PublicProfileNav from '../PublicProfileNav';
import SocialProfiles from '../SocialProfiles';
import style from './style.module.scss';

interface IProps {
  profile: ProfileDTO;
}

interface IPropsSession {
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  scrollToPosition: any;
}


const ProfileComponent: React.FC<IPropsSession> = ({ profile, sessionItem, scrollToPosition }: IPropsSession) => {

  const scrollToCard = (cardName: string) => {
    if (cardName === "about") {
      scrollToPosition(0);
    }
    if (cardName === "experience") {
      scrollToPosition(250);
    }
    if (cardName === "education") {
      scrollToPosition(450);
    }
  }

  return (
    <>
      <IonGrid className={style['fixed']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9" className="ion-no-padding"><ProfileBanner /></IonCol>
          <IonCol size="9" className="ion-no-padding"><ProfileHeader profile={profile} /></IonCol>
          <IonCol size="9" className="ion-no-padding"><PublicProfileNav profile={profile} scrollToPosition={scrollToCard} /></IonCol>
        </IonRow>
      </IonGrid >

      <IonGrid className={style['scroll']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9">
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  <AboutCard basicDTO={profile.basicDTO} mode="read" />
                  <ExperienceCard experienceDTO={profile.experienceDTO} mode="read" />
                  <EducationCard educationDTO={profile.educationDTO} mode="read" />
                </IonCol>
                <IonCol size="3">
                  <SocialProfiles />
                  <FollowingList did={profile.basicDTO.did} />
                  <FollowersWidget />
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow >
      </IonGrid >
    </>

  );
};

export default ProfileComponent;
