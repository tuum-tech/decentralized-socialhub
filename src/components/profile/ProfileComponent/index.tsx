import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React, { useRef, useState } from 'react';

import AboutCard from '../../cards/AboutCard';
import EducationCard from '../../cards/EducationCard';
import ExperienceCard from '../../cards/ExperienceCard';
import FollowersWidget from '../../follow/FollowersWidget';
import FollowingList from '../../follow/FollowingList';
import PublicProfileNav from '../PublicProfileNav';
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
  const [scrolled, setScrolled] = useState(false);
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

        {/* <span>{scrollTop}</span> */}
        {profile.basicDTO.isEnabled === true ? (
          <PublicProfileNav
            mode={mode}
            profile={profile}
            scrollToPosition={scrollToElement}
          />
        ) : (
          ''
        )}
        {/* </div> */}
        <IonGrid className={style['scroll']}>
          <IonRow className="ion-justify-content-center">
            <IonCol size="12">
              <IonGrid>
                <IonRow>
                  <IonCol size="9">
                    {!error && profile.basicDTO.isEnabled === true ? (
                      <div ref={aboutRef}>
                        <AboutCard
                          aboutText={profile.basicDTO.about}
                          mode="read"
                        />
                      </div>
                    ) : (
                      ''
                    )}
                    {!error && profile.experienceDTO.isEnabled === true ? (
                      <div ref={experienceRef}>
                        <ExperienceCard
                          experienceDTO={profile.experienceDTO}
                          mode="read"
                        />
                      </div>
                    ) : (
                      ''
                    )}
                    {!error && profile.educationDTO.isEnabled === true ? (
                      <div ref={educationRef}>
                        <EducationCard
                          educationDTO={profile.educationDTO}
                          mode="read"
                        />
                      </div>
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
      </IonContent>
    </>
  );
};

export default ProfileComponent;
