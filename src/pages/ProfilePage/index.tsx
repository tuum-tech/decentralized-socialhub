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

import React, { useEffect, useState } from 'react';
import style from './style.module.scss';
import { ExporeTime } from './constants';
import { requestFullProfile } from './fetchapi';

import Logo from 'src/components/Logo';
import Navbar from 'src/components/layouts/Navbar';
import {
  AccountType,
  ISessionItem,
  UserService
} from 'src/services/user.service';
import LoggedHeader from 'src/components/layouts/LoggedHeader';
import { EducationItem, ExperienceItem } from '../PublicPage/types';

import TutorialComponent from './components/Tutorial';
import DashboardContent from './components/Content';
import OnBoarding from './components/OnBoarding';
import StartService from './components/StartService';

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
  const [userInfo, setUserInfo] = useState<ISessionItem>({
    hiveHost: '',
    userToken: '',
    accountType: AccountType.DID,
    did: '',
    name: '',
    email: '',
    isDIDPublished: false,
    mnemonics: '',
    passhash: '',
    onBoardingCompleted: true,
    tutorialStep: 1
  });

  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      name: '',
      did: '',
      email: '',
      hiveHost: '',
      title: '',
      about: '',
      address: {
        number: '',
        street_name: '',
        postal_code: '',
        state: '',
        country: ''
      }
    },
    educationDTO: {
      isEnabled: false,
      items: [] as EducationItem[]
    },
    experienceDTO: {
      isEnabled: false,
      items: [] as ExperienceItem[]
    }
  });
  const [onboardingCompleted, setOnboardingStatus] = useState(true);
  const [loadingText, setLoadingText] = useState('');

  useEffect(() => {
    (async () => {
      let instance = UserService.GetUserSession();
      if (!instance) {
        return;
      }

      setUserInfo(instance);
      setOnboardingStatus(instance.onBoardingCompleted);

      if (
        instance.onBoardingCompleted &&
        instance.tutorialStep === 4 &&
        !willExpire
      ) {
        let profile = await requestFullProfile(instance.did);
        if (profile) {
          profile.experienceDTO.isEnabled = true;
          profile.educationDTO.isEnabled = true;
          setfull_profile(profile);
        }

        setWillExpire(true);
        setTimeout(() => {
          UserService.logout();
          window.location.href = '/';
        }, ExporeTime);
      }
    })();
  }, []);

  const onTutorialStart = () => {
    setShowTutorial(true);
  };

  const onTutorialFinish = async (step: number) => {
    setLoadingText('Updating Loading Status on Vault');
    let userSession = UserService.GetUserSession();
    if (userSession && userSession.did) {
      userSession.tutorialStep = step;
      await UserService.updateSession(userSession);
      setUserInfo(userSession);
    }
    setShowTutorial(false);
    setLoadingText('');
  };

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
      <IonContent className={style['profilepage']}>
        <IonGrid className={style['profilepagegrid']}>
          <IonRow className={style['profilecontent']}>
            <IonCol size="2" className={style['left-panel']}>
              <Logo />
              <Navbar tab="dashboard" />
            </IonCol>
            {/* <IonCol size='7' className={style['center-panel']}>
              <ProfileComponent profile={profile} />
            </IonCol> */}
            <IonCol size="10" className={style['right-panel']}>
              <LoggedHeader profile={full_profile} sessionItem={userInfo} />
              <DashboardContent
                onTutorialStart={onTutorialStart}
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
          <TutorialComponent onClose={onTutorialFinish} />
        </TutorialModal>
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
