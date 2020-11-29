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
  IonCol
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
import { RouteComponentProps } from 'react-router';
import { BaseplateResp } from 'src/baseplate/request';

const ProfilePage: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [profile, setProfile] = useState({ profile: { lastName: { localized: { fr_FR: "" } }, firstName: { localized: { fr_FR: "" } } } } as ProfileContent);

  const getProfile = async (token: string): Promise<ProfileResponse> => {
    return await requestLinkedinProfile(token) as ProfileResponse;
  }

  useEffect(() => {
    let token: string = new URLSearchParams(props.location.search).get("token") || "";
    (async () => {
      getProfile(token).then((x: ProfileResponse) => {
        let p = x.data as ProfileContent;
        setProfile(p);
      }).catch((error) => {
        //alert(JSON.stringify(error));
        let fallback = { profile: { lastName: { localized: { fr_FR: "Diego" } }, firstName: { localized: { fr_FR: "Chagastelles" } } } }
        setProfile(fallback);
      })
    })();
  }, []);


  return (
    <IonPage className={style["profilepage"]}>
      <IonHeader>

      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow className={style["profilecontent"]}>
            <IonCol size="3" className={style["left-panel"]}>
              <FollowingList />

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
