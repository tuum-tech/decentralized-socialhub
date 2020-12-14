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
import { fetchSimpleApi, requestLinkedinProfile } from './fetchapi';
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


const ProfilePage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [profile, setProfile] = useState({ profile: { localizedFirstName: "", localizedLastName: "" } } as ProfileContent);

  const getProfile = async (token: string): Promise<ProfileResponse> => {
    return await requestLinkedinProfile(token) as ProfileResponse;
  }
  let token: string = new URLSearchParams(props.location.search).get("token") || "";

  useEffect(() => {
    (async () => {
      if (token != "") {
        getProfile(token).then((x: ProfileResponse) => {
          console.log(x.data);
          let p = x.data as ProfileContent;
          setProfile(p);
        }).catch((error) => {
          console.error(error);
          let fallback = { profile: { localizedFirstName: "Jane", localizedLastName: "Fallback" } }
          setProfile(fallback);
        });
      }

    })();
  }, [token]);


  return (
    <IonPage className={style["profilepage"]}>
      <IonHeader>
        <IonGrid>
          <IonRow>
            <IonCol size="1"><img src={logo} /></IonCol>
            <IonCol size="3">
              <IonSearchbar placeholder="Search Profiles, Pages, Validators" className={style["search-input"]}></IonSearchbar>
            </IonCol>
            <IonCol size="3">
              <IonGrid>
                <IonRow className="ion-justify-content-start">
                  <IonCol><div className={style["home"]}><img src={home} /> <span>Home</span></div></IonCol>
                  <IonCol><div className={style["community"]}><img src={community} /><span>Community</span></div></IonCol>
                  <IonCol><div className={style["pages"]}><img src={pages} /><span>Pages</span></div></IonCol>
                  <IonCol><div className={style["messages"]}><img src={messages} /><span>Messages</span></div></IonCol>
                </IonRow>
              </IonGrid>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow className={style["profilecontent"]}>
            <IonCol size="3" className={style["left-panel"]}>
              <FollowingList />
              <PagesComponent />
            </IonCol>
            <IonCol size="6" className={style["center-panel"]}>
              <ProfileComponent profile={profile} />
            </IonCol>
            <IonCol size="3" className={style["right-panel"]}>
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
  ProfilePage,
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
