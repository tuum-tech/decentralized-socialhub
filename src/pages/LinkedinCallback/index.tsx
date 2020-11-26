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
  IonButton
} from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useState } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, ProfileResponse, SubState, TokenResponse } from './types';
import { requestLinkedinProfile, requestLinkedinToken } from './fetchapi';
import { RouteComponentProps, useParams } from 'react-router-dom';
import { Interface } from 'readline';
import { createConstructSignature } from 'typescript';

const LinkedinCallback: React.FC<RouteComponentProps> = (props) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [msg, setMsg] = useState('');
  const getToken = async (code: string, state: string): Promise<TokenResponse> => {
    return await requestLinkedinToken(code, state) as TokenResponse;
  }

  const getProfile = async (token: string): Promise<ProfileResponse> => {
    return await requestLinkedinProfile(token) as ProfileResponse;
  }

  let code: string = new URLSearchParams(props.location.search).get("code") || "";
  let state: string = new URLSearchParams(props.location.search).get("state") || "";



  getToken(code, state).then((x: TokenResponse) => {
    console.log(x.data.request_token);

    getProfile(x.data.request_token).then((x: ProfileResponse) => {
      alert(JSON.stringify(x.data));
    });

  });

  return (
    <IonPage className={style["loginpage"]}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login Page</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard className="welcome-card">
          <IonCardHeader>
            <IonCardSubtitle>{code}</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>

            <IonButton routerLink="/home"
              expand="full"
              color="primary">Login</IonButton>
            <IonButton routerLink="/register"
              expand="full"
              color="medium">Register</IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>

    </IonPage>
  )
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
  LinkedinCallback,
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
