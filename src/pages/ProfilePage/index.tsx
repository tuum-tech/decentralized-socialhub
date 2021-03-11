/**
 * Page
 */
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
} from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { NameSpace, ExporeTime } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, ProfileResponse, SubState } from './types';
import { requestFullProfile } from './fetchapi';
import FollowingList from 'src/components/FollowingList';
import Pages from 'src/components/Pages';
import ProfileCompletion from 'src/components/ProfileCompletion';
import PagesComponent from 'src/components/PagesComponent';
import { RouteComponentProps } from 'react-router';
import logo from '../../assets/Logo-Vertical.svg';
import home from '../../assets/home.svg';
import community from '../../assets/people-outline.svg';
import pages from '../../assets/person-search-outline.svg';
import messages from '../../assets/message-circle-outline.svg';
import photo from '../../assets/photo.png';
import StartServiceComponent from 'src/components/StartServiceComponent';
import ProfileTemplateManager from 'src/components/ProfileTemplateManager';
import { Link } from 'react-router-dom';
import Logo from 'src/components/Logo';
import Navbar from 'src/components/Navbar';
import DashboardNav from 'src/components/DashboardNav';
import { EducationItem, ExperienceItem, ProfileDTO } from '../PublicPage/types';
import OnBoarding from 'src/components/OnBoarding';
import {
  AccountType,
  ISessionItem,
  UserData,
  UserService,
} from 'src/services/user.service';
import { userInfo } from 'os';
import LoggedHeader from 'src/components/LoggedHeader';
import TutorialComponent from 'src/components/Tutorial';
import styled from 'styled-components';


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

const ProfilePage: React.FC<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [error, setError] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [willExpire, setWillExpire] = useState(false)
  const [userInfo, setUserInfo] = useState<ISessionItem>({
    hiveHost: '',
    userToken: '',
    accountType: AccountType.DID,
    did: '',
    name: '',
    email: '',
    isDIDPublished: false,
    mnemonics: '',
    onBoardingCompleted: false,
    tutorialCompleted: false,
  })

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
        country: '',
      },
    },
    educationDTO: {
      isEnabled: false,
      items: [] as EducationItem[],
    },
    experienceDTO: {
      isEnabled: false,
      items: [] as ExperienceItem[],
    },
  })
  const [onboardingCompleted, setOnboardingStatus] = useState(false)

  const [active, setActive] = useState('dashboard')

  // const getProfile = async (token: string): Promise<ProfileResponse> => {
  //   return (await requestLinkedinProfile(token)) as ProfileResponse
  // }
  // let token: string =
  //   new URLSearchParams(props.location.search).get('token') || ''

  // const getPublicUrl = (): string => {
  //   let item = window.sessionStorage.getItem('session_instance')
  //   if (!item) {
  //     throw Error('Not logged in')
  //   }
  //   let instance = JSON.parse(item)
  //   return '/did/' + instance.did
  // }

  const getFullProfile = async (did: string): Promise<any> => {
    return await requestFullProfile(did)
  }

  useEffect(() => {
    (async () => {

      let instance = UserService.GetUserSession()
      if (!instance) return

      setUserInfo(instance);
      console.error(JSON.stringify(userInfo));
      if (instance.onBoardingCompleted && instance.tutorialCompleted && !willExpire) {

        try {
          let profile: ProfileDTO = await getFullProfile(instance.did)
          profile.experienceDTO.isEnabled = true
          profile.educationDTO.isEnabled = true
          setfull_profile(profile)
        } catch (e) {
          setError(true)
        }

        setWillExpire(true)
        setTimeout(() => {
          UserService.logout()
          window.location.href = '/'
        }, ExporeTime)
      }
      setOnboardingStatus(instance.onBoardingCompleted)
    })()
  }, [])

  const onTutorialStart = () => {
    console.log('Start tutorial')
    setShowTutorial(true)
  }

  if (!onboardingCompleted) {
    return (
      <OnBoarding
        completed={() => {
          UserService.setOnBoardingCompleted()
          setOnboardingStatus(true)
          if (!willExpire) {
            setWillExpire(true)
            setTimeout(() => {
              UserService.logout()
              window.location.href = '/'
            }, ExporeTime)
          }
        }}
      />
    )
  }

  return (
    <IonPage>
      <IonContent className={style['profilepage']}>
        <IonGrid className={style['profilepagegrid']}>
          <IonRow className={style['profilecontent']}>
            <IonCol size='2' className={style['left-panel']}>
              <Logo />
              <Navbar tab='dashboard' />
            </IonCol>
            {/* <IonCol size='7' className={style['center-panel']}>
              <ProfileComponent profile={profile} />
            </IonCol> */}
            <IonCol size='10' className={style['right-panel']}>
              <LoggedHeader profile={full_profile} sessionItem={userInfo} />

              <DashboardNav
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
          <TutorialComponent onClose={() => setShowTutorial(false)} />
        </TutorialModal>
      </IonContent>
    </IonPage>
  )
}

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg(),
})

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax()),
    },
  }
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(ProfilePage, {
  key: NameSpace,
  reducer,
  saga,
})

const withConnect = connect(mapStateToProps, mapDispatchToProps)

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>

// export default Tab1;
