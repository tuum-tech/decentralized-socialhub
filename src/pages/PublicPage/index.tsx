/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import {
  EducationItem,
  ExperienceItem,
  InferMappedProps,
  ProfileDTO,
  SubState,
} from './types';
import { requestFullProfile } from './fetchapi';
import FollowingList from 'src/components/FollowingList';
import { RouteComponentProps } from 'react-router';
import Logo from 'src/components/Logo';
import Navbar from 'src/components/Navbar';
import ProfileHeader from 'src/components/ProfileHeader';
import DashboardNav from 'src/components/DashboardNav';
import PublicNavbar from 'src/components/PublicNavbar';
import RegisterNewUserButton from 'src/components/RegisterNewUserButton';
import SignInButton from 'src/components/SignInButton';
import ProfileComponent from 'src/components/ProfileComponent';

interface MatchParams {
  did: string;
}

interface Props extends RouteComponentProps<MatchParams> {}

const PublicPage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [full_profile, setfull_profile] = useState({
    basicDTO: {
      isEnabled: false,
      first_name: '',
      last_name: '',
      did: '',
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
      isEnabled: true,
      items: [] as EducationItem[],
    },
    experienceDTO: {
      isEnabled: true,
      items: [] as ExperienceItem[],
    },
  });

  const getFullProfile = async (did: string): Promise<any> => {
    return await requestFullProfile(did);
  };

  let did: string = props.match.params.did || '';

  useEffect(() => {
    (async () => {
      let profile: ProfileDTO = await getFullProfile(did);
      setfull_profile(profile);
    })();
  }, []);

  return (
    <IonPage className={style['profilepage']}>
      <IonContent>
        <IonGrid className={style['profilepagegrid']}>
          <PublicNavbar className='ion-justify-content-between'>
            <IonCol size='auto'>
              <img src='../../assets/logo_profile_black.svg' />
            </IonCol>
            <IonCol size='auto'>
              <IonRow>
                <IonCol>
                  <RegisterNewUserButton to='/create/profile'>
                    Register new user
                  </RegisterNewUserButton>
                </IonCol>
                <IonCol>
                  <SignInButton to='/create/profile'>Sign In</SignInButton>
                </IonCol>
              </IonRow>
            </IonCol>
          </PublicNavbar>

          <IonRow className='ion-justify-content-around'>
            <IonCol size='12'>
              <ProfileComponent profile={full_profile} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>

    // <IonPage className={style['profilepage']}>
    //   <IonContent>
    //     <IonGrid>
    //       <IonRow>
    //         <IonCol size='6'>
    //           {/* <FollowingList did={did} /> */}
    //         </IonCol>
    //       </IonRow>
    //       <IonRow>
    //         <IonCol size='6'>
    //           <h1>basic profile</h1>
    //           <span>{JSON.stringify(basic_profile)}</span>
    //         </IonCol>
    //         <IonCol size='6'>
    //           <h1>education profile</h1>
    //           <span>{JSON.stringify(education_profile)}</span>
    //         </IonCol>
    //       </IonRow>
    //     </IonGrid>
    //   </IonContent>
    // </IonPage>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg(),
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax()),
    },
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(PublicPage, {
  key: NameSpace,
  reducer,
  saga,
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
