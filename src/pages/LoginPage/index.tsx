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
  IonInput
} from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useState, useCallback } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';
import { fetchSimpleApi, requestLinkedinLogin } from './fetchapi';
import history from 'src/baseplate/history'
import { Link } from 'react-router-dom';
import { BaseplateResp } from 'src/baseplate/request';

const LoginPage: React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [msg, setMsg] = useState('');
  const simpleAjaxDirect = async () => {
    const msg = await fetchSimpleApi() as string;
    setMsg(msg);
  }

  const linkedinlogin = async () => {
    type MyType = { meta: string; data: string; }

    // gets the linkedin auth endpoint
    const url = await requestLinkedinLogin() as MyType;
    console.log(url.data);

    // redirects 
    window.location.href = url.data;
  }

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
            <IonCardSubtitle>Authentication</IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            <IonInput type="text" placeholder="youremail@elastos.internet" className={style['input']} />
            <IonInput type="password" placeholder="P@ssw0rd" className={style['input']} />
            <IonButton routerLink="/home"
              expand="full"
              color="primary">Login</IonButton>
            <IonButton routerLink="/register"
              expand="full"
              color="medium">Register</IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle>Social Login</IonCardSubtitle>
            <IonCardTitle className={style['simple-resp']}>{props.msg}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton

              expand="full"
              color="danger">Login with Google</IonButton>
            <IonButton
              expand="full"
              color="secondary">Login with Twitter</IonButton>
            <IonButton
              onClick={linkedinlogin}
              expand="full"
              color="tertiary">
              Login with LinkedIn
            </IonButton>

            <IonButton
              expand="full"
              color="success">Login with Elastos</IonButton>
          </IonCardContent>
        </IonCard>

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
  LoginPage,
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
