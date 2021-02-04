/**
 * Page
 */
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonInput,
  IonSearchbar
} from '@ionic/react';
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
import { InferMappedProps, ProfileContent, ProfileResponse, SubState } from './types';
import { requestBasicProfile, requestEducationProfile, requestVaultProfile } from './fetchapi';
import FollowingList from 'src/components/FollowingList';
import Pages from 'src/components/Pages';
import ProfileCompletion from 'src/components/ProfileCompletion';
import ProfileComponent from 'src/components/ProfileComponent';
import PagesComponent from 'src/components/PagesComponent';
import { RouteComponentProps } from 'react-router';
import { BaseplateResp } from 'src/baseplate/request';
import logo from '../../assets/Logo-Vertical.svg';
import home from '../../assets/home.svg';
import community from '../../assets/people-outline.svg';
import pages from '../../assets/person-search-outline.svg';
import messages from '../../assets/message-circle-outline.svg';
import photo from '../../assets/photo.png';
import StartServiceComponent from 'src/components/StartServiceComponent';
import { ProfileInfo } from '../ProfilePage/types';
import { HiveService } from 'src/services/hive.service';

interface MatchParams {
  did: string;
}

interface Props extends RouteComponentProps<MatchParams> {
}

const PublicPage: React.FC<RouteComponentProps<MatchParams>> = (props: RouteComponentProps<MatchParams>) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [profile, setProfile] = useState({ profile: {} });
  const [basic_profile, setbasic_profile] = useState({});
  const [education_profile, seteducation_profile] = useState({});

  const getProfile = async (did: string): Promise<ProfileContent> => {
    return await requestVaultProfile(did) as ProfileContent;
  }

  const getBasicProfile = async (did: string): Promise<any> => {
    return await requestBasicProfile(did);
  }

  const getEducationProfile = async (did: string): Promise<any> => {
    return await requestEducationProfile(did);
  }


  let did: string = props.match.params.did || "";

  useEffect(() => {
    (async () => {


      let basic_profile = await getBasicProfile(did);
      setbasic_profile(basic_profile);

      let education_profile = await getEducationProfile(did);
      seteducation_profile(education_profile);


    })();
  }, []);


  return (
    <IonPage className={style["profilepage"]}>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol size="6">
              <FollowingList did={did} />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="6">
              <h1>basic profile</h1>
              <span>{JSON.stringify(basic_profile)}</span>
            </IonCol>
            <IonCol size="6">
              <h1>education profile</h1>
              <span>{JSON.stringify(education_profile)}</span>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage >
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
    eProps: { // eProps - Emitter proptypes thats binds to dispatch
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
const withInjectedMode = injector(
  PublicPage,
  {
    key: NameSpace,
    reducer,
    saga
  }
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

      // export default Tab1;
