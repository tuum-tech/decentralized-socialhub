import { IonCol, IonGrid, IonRow } from '@ionic/react';
import React from 'react';

import { ProfileDTO } from 'src/pages/PublicPage/types';
import { ISessionItem } from 'src/services/user.service';

import AboutCard from '../../cards/AboutCard';
import EducationCard from '../../cards/EducationCard';
import ExperienceCard from '../../cards/ExperienceCard';
import FollowersWidget from '../../follow/FollowersWidget';
import FollowingList from '../../follow/FollowingList';
import PublicProfileNav from '../PublicProfileNav';
import SocialProfiles from '../../SocialProfiles';

import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';
import style from './style.module.scss';

interface IProps {
  profile: ProfileDTO;
}

interface IPropsSession {
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  scrollToPosition: any;
  error: boolean;
}

const ProfileComponent: React.FC<IPropsSession> = ({
  profile,
  sessionItem,
  scrollToPosition,
  error
}: IPropsSession) => {
  const scrollToCard = (cardName: string) => {
    if (cardName === 'about') {
      scrollToPosition(0);
    }
    if (cardName === 'experience') {
      scrollToPosition(280);
    }
    if (cardName === 'education') {
      scrollToPosition(525);
    }
  };

  return (
    <>
      <IonGrid className={style['fixed']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9" className="ion-no-padding">
            <ProfileBanner />
          </IonCol>

          <IonCol size="9" className="ion-no-padding">
            <ProfileHeader
              profile={profile}
              sessionItem={sessionItem}
              error={error}
            />
          </IonCol>
          {profile.basicDTO.isEnabled === true ? (
            <IonCol size="9" className="ion-no-padding">
              <PublicProfileNav
                profile={profile}
                scrollToPosition={scrollToCard}
              />
            </IonCol>
          ) : (
            ''
          )}
        </IonRow>
      </IonGrid>

      <IonGrid className={style['scroll']}>
        <IonRow className="ion-justify-content-center">
          <IonCol size="9">
            <IonGrid>
              <IonRow>
                <IonCol size="9">
                  {!error && profile.basicDTO.isEnabled === true ? (
                    <AboutCard aboutText={profile.basicDTO.about} />
                  ) : (
                    ''
                  )}
                  {!error && profile.experienceDTO.isEnabled === true ? (
                    <ExperienceCard experienceDTO={profile.experienceDTO} />
                  ) : (
                    ''
                  )}
                  {!error && profile.educationDTO.isEnabled === true ? (
                    <EducationCard educationDTO={profile.educationDTO} />
                  ) : (
                    ''
                  )}
                </IonCol>
                <IonCol size="3">
                  {!error && profile.basicDTO.isEnabled === true ? (
                    <SocialProfiles />
                  ) : (
                    ''
                  )}
                  {!error && profile.basicDTO.isEnabled === true ? (
                    <FollowingList did={profile.basicDTO.did} />
                  ) : (
                    ''
                  )}
                  {!error && profile.basicDTO.isEnabled === true ? (
                    <FollowersWidget />
                  ) : (
                    ''
                  )}
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCol>
        </IonRow>
      </IonGrid>
    </>
  );
};

export default ProfileComponent;
