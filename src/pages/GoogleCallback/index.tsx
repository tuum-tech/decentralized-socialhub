/**
 * Page
 */
import {
  IonHeader,
  IonPage,
  IonInput,
  IonCol,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonText,
  // Header,
} from '@ionic/react';
import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Redirect, RouteComponentProps, useParams } from 'react-router-dom';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';

import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState, TokenResponse } from './types';
import { requestGoogleId, requestGoogleToken } from './fetchapi';
import { UserService } from 'src/services/user.service';
import { stringify } from 'querystring';

const GoogleCallback : React.FC<RouteComponentProps> = (props) => {
  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */

  const [storagePassword, setStoragePassword] = useState('');
  const [repeatStoragePassword, setRepeatStoragePassword] = useState('');
  const [error, setError] = useState('');
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    id: '',
    email: '',
    name: '',
    request_token: '',
  })
  const getToken = async (code: string, state: string): Promise<TokenResponse> => {
    return await requestGoogleToken(code, state) as TokenResponse;
  }

  let code: string = new URLSearchParams(props.location.search).get("code") || "";
  let state: string = new URLSearchParams(props.location.search).get("state") || "";

  useEffect(() => {
    (async () => {
      if (code != "" && state != "" && credentials.request_token === '') {
        let t = await getToken(code, state);
        let googleId = await requestGoogleId(t.data.request_token)
        setCredentials({
          id: googleId.id,
          name: googleId.name,
          request_token: t.data.request_token,
          email: googleId.email
        })
      }
    })();
  });

  const encryptProfile = async () => {
    setError('')
    if (storagePassword !== repeatStoragePassword) {
      setError('Password is different');
    } else {
      setLoading(true);
      await loginToProfile(storagePassword);
    }
  }

  const loginToProfile = async (pwd: string = '') => {
    // await UserService.SignInWithGoogle(googleId.id, googleId.name, t.data.request_token, googleId.email)
    await UserService.SignInWithGoogle(credentials.id, credentials.name, credentials.request_token, credentials.email, pwd);
    setLoading(false);
    setIsLogged(true);
  }

  const getRedirect = () => {
    if (isLogged) {
      return (<Redirect to={{pathname: '/profile' }} />)
    } else if (credentials.request_token === '') {
      return <p>Generating DID user</p>;
    } else {
      return (
        <IonPage className={style["elastosmnemonicpage"]}>
          <div className={style["main-container"]}>
            <div>
              <h1>Storage Password</h1>
              <div className={style["warning-light"]}>
                <p className={style["text"]}>
                  Create a password to storage your profile
                </p>
              </div>
              <div >
                <IonRow style={{ marginTop: '100px' }}>
                  <IonCol >
                    <IonInput type="password" className={style["addressInput"]} value={storagePassword} onIonChange={(event) => setStoragePassword((event.target as HTMLInputElement).value)} placeholder="New password" >
                    </IonInput>
                    <br />
                    <IonInput type="password" className={style["addressInput"]} value={repeatStoragePassword} onIonChange={(event) => setRepeatStoragePassword((event.target as HTMLInputElement).value)} placeholder="Retype your password" >
                    </IonInput>
                  </IonCol>
                </IonRow>
              </div>
              <div style={{ textAlign: 'center', marginTop: '100px' }}>
                <IonButton disabled={loading} onClick={encryptProfile}>{ loading ? 'Encrypting now.......' : 'Encrypt and Save'}</IonButton>
                <IonButton disabled={loading} onClick={async() => {
                  await loginToProfile();
                }}>
                  skip
                </IonButton>
                <IonText>{error}</IonText>
              </div>
            </div>
          </div>
        </IonPage>
      )

    }
  }
  return getRedirect();
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
  GoogleCallback,
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
