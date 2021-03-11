import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import { userInfo } from 'os';
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
      scrollToPosition(280);
    }
    if (cardName === "education") {
      scrollToPosition(525);
    }
  }

  return (
    <>
      <IonGrid className={style['fixed']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9" className="ion-no-padding"><ProfileBanner /></IonCol>
          <IonCol size="9" className="ion-no-padding"><ProfileHeader profile={profile} sessionItem={sessionItem} /></IonCol>
          {profile.basicDTO.isEnabled === true ? <IonCol size="9" className="ion-no-padding"><PublicProfileNav profile={profile} scrollToPosition={scrollToCard} /></IonCol> : ""}
        </IonRow>
      </IonGrid >

      <IonGrid className={style['scroll']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9">
            <IonGrid>
              <IonRow>
                <IonCol size="9">

                  {profile.basicDTO.isEnabled === true ? <AboutCard basicDTO={profile.basicDTO} mode="read" /> : ""}
                  {profile.experienceDTO.isEnabled === true ? <ExperienceCard experienceDTO={profile.experienceDTO} mode="read" /> : ""}
                  {profile.educationDTO.isEnabled === true ? <EducationCard educationDTO={profile.educationDTO} mode="read" /> : ""}
                </IonCol>
                <IonCol size="3">
                  {profile.basicDTO.isEnabled === true ? <SocialProfiles /> : ""}
                  {profile.basicDTO.isEnabled === true ? <FollowingList did={profile.basicDTO.did} /> : ""}
                  {profile.basicDTO.isEnabled === true ? <FollowersWidget /> : ""}
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
