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

import React, { useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { ExporeTime } from './constants';

import Logo from 'src/components/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import { UserService } from 'src/services/user.service';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import LoadingIndicator from 'src/components/LoadingIndicator';
import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';

import TutorialComponent from './components/Tutorial';
import DashboardContent from './components/Content';
import OnBoarding from './components/OnBoarding';
import DashboardHeader from './components/DashboardHeader';
import { DidDocumentService } from 'src/services/diddocument.service';

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
  const [didDocument, setDidDocument] = useState({});
  const [publishStatus, setPublishStatus] = useState(RequestStatus.Pending);
  const [onBoardVisible, setOnBoardVisible] = useState(false);
  const history = useHistory();

  const setTimerForDid = () => {
    const timer = setTimeout(async () => {
      await refreshDidDocument();
      setTimerForDid();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const setTimerForStatus = () => {
    const timer = setTimeout(async () => {
      await refreshStatus();
      setTimerForStatus();
    }, 5000);
    return () => clearTimeout(timer);
  };

  const refreshDidDocument = async () => {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      return;
    }
    let documentState = await DidDocumentService.getUserDocument(userSession);
    setDidDocument(documentState.diddocument);
  };

  const refreshStatus = async () => {
    let userSession = UserService.GetUserSession();
    if (!userSession || !userSession.did) return;

    let publishWaiting = AssistService.getPublishStatusTask(userSession.did);

    if (!publishWaiting) return;

    let actual = await AssistService.refreshRequestStatus(
      publishWaiting.confirmationId,
      userSession.did
    );

    setPublishStatus(actual.requestStatus);

    if (actual.requestStatus === RequestStatus.Completed) {
      AssistService.removePublishTask(userSession.did);
      await updateUserToComplete();
      return;
    }
  };

  const updateUserToComplete = async () => {
    let userSession = UserService.GetUserSession();
    if (userSession) {
      userSession.isDIDPublished = true;
      UserService.updateSession(userSession);
      await DidDocumentService.reloadUserDocument();
    }
  };

  const retriveProfile = async () => {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      return;
    }
    setLoadingText('Please wait a moment...');
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
      await refreshDidDocument();
      setUserInfo(userSession);
      setPublishStatus(
        userSession.isDIDPublished
          ? RequestStatus.Completed
          : RequestStatus.Pending
      );
      setOnBoardVisible(true);
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
    setTimerForStatus();
    setTimerForDid();
  }, []);

  useEffect(() => {
    (async () => {
      let userSession = UserService.GetUserSession();
      if (!userSession) return;
      if (history.location.pathname === '/profile') {
        setOnBoardVisible(true);
        if (
          userSession.tutorialStep &&
          userSession.tutorialStep === 4 &&
          userSession.onBoardingCompleted
        ) {
          await retriveProfile();
        }
      }
    })();
  }, [history.location.pathname]);

  if (userInfo.tutorialStep < 4 && onBoardVisible) {
    return (
      <OnBoarding
        completed={async () => {
          let user = UserService.GetUserSession();
          if (!user) return;

          user.onBoardingCompleted = true;
          await UserService.updateSession(user);
          setUserInfo(user);
          setOnBoardVisible(false);
          if (!willExpire) {
            setWillExpire(true);
            setTimeout(() => {
              UserService.logout();
              window.location.href = '/';
            }, ExporeTime);
          }
        }}
        sessionItem={userInfo}
        publishStatus={publishStatus}
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
              <LeftSideMenu />
            </IonCol>
            {/* <IonCol size='7' className={style['center-panel']}>
              <ProfileComponent profile={profile} />
            </IonCol> */}
            <IonCol size="10" className={style['right-panel']}>
              <DashboardHeader
                profile={full_profile}
                sessionItem={userInfo}
                publishStatus={publishStatus}
              />
              <DashboardContent
                onTutorialStart={() => {
                  setShowTutorial(true);
                }}
                profile={full_profile}
                sessionItem={userInfo}
                didDocument={didDocument}
              />
              {/* <StartService /> */}
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
