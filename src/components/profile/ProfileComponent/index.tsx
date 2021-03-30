import {
  IonCol,
  IonContent,
  IonGrid,
  IonRow,
  IonCard,
  IonCardTitle,
  IonCardContent,
  IonCardHeader
} from '@ionic/react';
import React, { useRef, useState } from 'react';

import AboutCard from '../../cards/AboutCard';
import EducationCard from '../../cards/EducationCard';
import ExperienceCard from '../../cards/ExperienceCard';
// import FollowersWidget from '../FollowersWidget';
import FollowingList from '../FollowingList';
import PublicProfileTabs from '../PublicProfileTabs';
import SocialProfiles from '../SocialProfiles';
import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';
import style from './style.module.scss';

interface IProps {
  profile: ProfileDTO;
}

interface IPropsSession {
  profile: ProfileDTO;
  sessionItem?: ISessionItem;
  error: boolean;
}

const ProfileComponent: React.FC<IPropsSession> = ({
  profile,
  sessionItem,
  error
}: IPropsSession) => {
  const [scrollTop, setScrollTop] = useState(0);
  const [mode, setMode] = useState('normal');

  const handleScroll = (e: any) => {
    //if (e.detail.scrollTop - scrollTop > 10 || e.detail.scrollTop - scrollTop < -10)
    setScrollTop(e.detail.scrollTop);

    if (scrollTop > 176) setMode('sticky');
    else {
      setMode('normal');
    }
  };

  const contentRef = useRef<HTMLIonContentElement | null>(null);
  const aboutRef = useRef<HTMLDivElement | null>(null);
  const experienceRef = useRef<HTMLDivElement | null>(null);
  const educationRef = useRef<HTMLDivElement | null>(null);

  const scrollToElement = (cardName: string) => {
    let point: number = 0;
    let adjust = 0;
    if (scrollTop < 176) adjust = 292 - scrollTop;
    else {
      adjust = 260 - scrollTop;
    }

    if (cardName === 'about') {
      point = 0;
    }
    if (cardName === 'experience') {
      point = (experienceRef.current!.getBoundingClientRect().top -
        adjust) as number;
    }
    if (cardName === 'education') {
      point = (educationRef.current!.getBoundingClientRect().top -
        adjust) as number;
    }
    contentRef.current && contentRef.current.scrollToPoint(0, point, 200);
  };

  return (
    <>
      <IonContent
        ref={contentRef}
        className={style['profilecomponent']}
        scrollEvents={true}
        onIonScroll={handleScroll}
      >
        <ProfileBanner mode={mode} />

        <ProfileHeader
          mode={mode}
          profile={profile}
          user={sessionItem as ISessionItem}
          error={error}
        />

        {profile.basicDTO.isEnabled === true ? (
          <>
            <PublicProfileTabs
              mode={mode}
              profile={profile}
              scrollToPosition={scrollToElement}
            />
            <IonGrid className={style['scroll']}>
              <IonRow className="ion-justify-content-center">
                <IonCol size="12">
                  <IonGrid>
                    <IonRow>
                      <IonCol size="9">
                        <div ref={aboutRef}>
                          <AboutCard
                            aboutText={profile.basicDTO.about}
                            mode="read"
                          />
                        </div>
                        <div ref={experienceRef}>
                          <ExperienceCard
                            experienceDTO={profile.experienceDTO}
                            isEditable={false}
                          />
                        </div>
                        <div ref={educationRef}>
                          <EducationCard
                            educationDTO={profile.educationDTO}
                            isEditable={false}
                          />
                        </div>
                      </IonCol>
                      <IonCol size="3">
                        <SocialProfiles />
                        <FollowingList did={profile.basicDTO.did} />

                        {/* FollowersWidget */}

                        <IonCard className={style['overview']}>
                          <IonCardHeader>
                            <IonCardTitle>Followers</IonCardTitle>
                          </IonCardHeader>

                          <IonCardContent></IonCardContent>
                        </IonCard>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCol>
              </IonRow>
            </IonGrid>
          </>
        ) : (
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="auto">
                The content of this profile is not currently viewable
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </>
  );
};

export default ProfileComponent;
