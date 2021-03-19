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
import { connect } from 'react-redux';
import { compose } from 'redux';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { NameSpace, ExporeTime } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';
import { requestFullProfile } from './fetchapi';

import Logo from 'src/components/Logo';
import Navbar from 'src/components/layouts/Navbar';
import OnBoarding from 'src/components/OnBoarding';
import {
  AccountType,
  ISessionItem,
  UserService
} from 'src/services/user.service';
import LoggedHeader from 'src/components/layouts/LoggedHeader';
import TutorialComponent from 'src/components/Tutorial';
import { EducationItem, ExperienceItem, ProfileDTO } from '../PublicPage/types';

import DashboardContent from './components/Content';

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

const ProfilePage: React.FC<RouteComponentProps> = () => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

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
    tutorialCompleted: false
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
        instance.tutorialCompleted &&
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

  const onTutorialFinish = () => {
    let instance = UserService.GetUserSession();
    if (instance) {
      setUserInfo(instance);
      setShowTutorial(false);
    }
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
              {/* <StartServiceComponent />
              <ProfileCompletion /> */}
            </IonCol>
          </IonRow>
        </IonGrid>

        <TutorialModal
          isOpen={showTutorial}
          cssClass={style['tutorialpage']}
          backdropDismiss={false}
        >
          <TutorialComponent onClose={() => onTutorialFinish()} />
        </TutorialModal>
      </IonContent>
    </IonPage>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(ProfilePage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
