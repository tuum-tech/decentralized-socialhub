/**
 * Page
 */
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonModal
} from '@ionic/react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { ExporeTime } from './constants';

import Logo from 'src/components/Logo';
import DashboardNavBar from 'src/components/layouts/Navbar/DashboardNavbar';
import LoggedHeader from 'src/components/layouts/LoggedHeader';
import { ISessionItem, UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/components/LoadingIndicator';
import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';

import { ProfileDTO } from '../PublicPage/types';
import TutorialComponent from './components/Tutorial';
import DashboardContent from './components/Content';
import OnBoarding from './components/OnBoarding';

const TutorialModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 100%;
  --width: 100%;
  height: 100% !important;
  width: 100% !important;
  --background: transparent !important;
  --box-shadow: none !important;
`;

const ProfilePage = () => {
  const [showTutorial, setShowTutorial] = useState(false);
  const [willExpire, setWillExpire] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);
  const [full_profile, setfull_profile] = useState(defaultFullProfile);
  const [onboardingCompleted, setOnboardingStatus] = useState(true);
  const history = useHistory();

  const retriveProfile = async () => {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      return;
    }
    setLoadingText('Wait a while...');
    let profile: ProfileDTO | undefined = await ProfileService.getFullProfile(
      userSession.did
    );
    if (profile) {
      profile.experienceDTO.isEnabled = true;
      profile.educationDTO.isEnabled = true;
      setfull_profile(profile);
    }
    setLoadingText('');
  };

  useEffect(() => {
    (async () => {
      let userSession = UserService.GetUserSession();
      if (!userSession) {
        return;
      }

      setUserInfo(userSession);
      setOnboardingStatus(userSession.onBoardingCompleted);

      if (
        userSession.onBoardingCompleted &&
        userSession.tutorialStep === 4 &&
        !willExpire
      ) {
        setWillExpire(true);
        setTimeout(() => {
          UserService.logout();
          window.location.href = '/';
        }, ExporeTime);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let userSession = UserService.GetUserSession();
      if (
        !userSession ||
        userSession.tutorialStep ||
        userSession.tutorialStep !== 4 ||
        !userSession.onBoardingCompleted
      ) {
        return;
      } else if (history.location.pathname === '/profile') {
        await retriveProfile();
      }
    })();
  }, [history.location.pathname]);

  if (!onboardingCompleted) {
    return (
      <OnBoarding
        completed={async () => {
          let user = UserService.GetUserSession();
          if (!user) return;

          user.onBoardingCompleted = true;
          await UserService.updateSession(user);
          setOnboardingStatus(true);
          if (!willExpire) {
            setWillExpire(true);
            setTimeout(() => {
              UserService.logout();
              window.location.href = '/';
            }, ExporeTime);
          }
        }}
      />
    );
  }

  return (
    <IonPage>
      {loadingText && loadingText !== '' && (
        <LoadingIndicator loadingText={loadingText} />
      )}
      <IonContent className={style['profilepage']}>
        <IonGrid className={style['profilepagegrid']}>
          <IonRow className={style['profilecontent']}>
            <IonCol size="2" className={style['left-panel']}>
              <Logo />
              <DashboardNavBar />
            </IonCol>
            {/* <IonCol size='7' className={style['center-panel']}>
              <ProfileComponent profile={profile} />
            </IonCol> */}
            <IonCol size="10" className={style['right-panel']}>
              <LoggedHeader profile={full_profile} sessionItem={userInfo} />
              <DashboardContent
                onTutorialStart={() => {
                  setShowTutorial(true);
                }}
                profile={full_profile}
                sessionItem={userInfo}
              />
              {/* <StartService />
              <ProfileCompletion /> */}
            </IonCol>
          </IonRow>
        </IonGrid>

        <TutorialModal
          isOpen={showTutorial}
          cssClass={style['tutorialpage']}
          backdropDismiss={false}
        >
          <TutorialComponent
            onClose={() => {
              let userSession = UserService.GetUserSession();
              if (userSession && userSession.did !== '') {
                setUserInfo(userSession);
              }
              setShowTutorial(false);
            }}
          />
        </TutorialModal>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
