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
import { requestVaultProfile } from './fetchapi';
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

  const getProfile = async (did: string): Promise<ProfileContent> => {
    return await requestVaultProfile(did) as ProfileContent;
  }
  let did: string = props.match.params.did || "";

  useEffect(() => {
    (async () => {
      debugger;
      if (did !== "") {

        console.log("did: " + did);
        let profile = await getProfile(did);
        setProfile(profile);
      }

    })();
  }, []);


  return (
    <IonPage className={style["profilepage"]}>
      <IonHeader className={style["header"]}>
        <IonGrid>
          <IonRow>
            <IonCol size="0.5"><img className={style["logo"]} src={logo} /></IonCol>
            <IonCol size="2.5">
              <IonSearchbar placeholder="Search Profiles, Pages, Validators" className={style["search-input"]}></IonSearchbar>
            </IonCol>
            <IonCol size="6">
              <IonGrid>
                <IonRow className="ion-justify-content-center">
                  <IonCol size="auto"><div className={style["home"]}><img src={home} /> <span>Home</span></div></IonCol>
                  <IonCol size="auto"><div className={style["community"]}><img src={community} /><span>Community</span></div></IonCol>
                  <IonCol size="auto"><div className={style["pages"]}><img src={pages} /><span>Pages</span></div></IonCol>
                  <IonCol size="auto"><div className={style["messages"]}><img src={messages} /><span>Messages</span></div></IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
            <IonCol size="3">
              <img src={photo} className={style["profile-img"]} />
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow className={style["profilecontent"]}>
            <IonCol size="2.5" className={style["left-panel"]}>
              <FollowingList did={did} />
              <PagesComponent />
            </IonCol>
            <IonCol size="7" className={style["center-panel"]}>
              <ProfileComponent profile={profile} />
            </IonCol>
            <IonCol size="2.5" className={style["right-panel"]}>
              <StartServiceComponent />
              <ProfileCompletion />

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
