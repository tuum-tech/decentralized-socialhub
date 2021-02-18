/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';

import { UserService, AccountType } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';
import SetPassword from 'src/components/SetPassword';

import { TokenResponse } from './types';
import { requestGoogleId, requestGoogleToken } from './fetchapi';

const GoogleCallback: React.FC<RouteComponentProps> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    id: '',
    email: '',
    name: '',
    request_token: '',
  });
  const getToken = async (
    code: string,
    state: string
  ): Promise<TokenResponse> => {
    return (await requestGoogleToken(code, state)) as TokenResponse;
  };

  let code: string =
    new URLSearchParams(props.location.search).get('code') || '';
  let state: string =
    new URLSearchParams(props.location.search).get('state') || '';

  useEffect(() => {
    (async () => {
      if (code !== '' && state !== '' && credentials.request_token === '') {
        let t = await getToken(code, state);
        let googleId = await requestGoogleId(t.data.request_token);
        setCredentials({
          id: googleId.id,
          name: googleId.name,
          request_token: t.data.request_token,
          email: googleId.email,
        });
      }
    })();
  }, []);

  const loginToProfile = async (pwd: string = '') => {
    // await UserService.SignInWithGoogle(googleId.id, googleId.name, t.data.request_token, googleId.email)
    await UserService.getPrevDiD(credentials.id, AccountType.Google);

    // await UserService.SignInWithGoogle(
    //   credentials.id,
    //   credentials.name,
    //   credentials.request_token,
    //   credentials.email,
    //   pwd
    // );
    // setLoading(false);
    // setIsLogged(true);
  };

  const getRedirect = () => {
    if (isLogged) {
      return <Redirect to={{ pathname: '/profile' }} />;
    } else if (credentials.request_token === '') {
      return <PageLoading />;
    } else {
      return (
        <SetPassword
          next={async (pwd) => {
            setLoading(true);
            await loginToProfile(pwd);
          }}
          displayText={loading ? 'Encrypting now.......' : ''}
        />
      );
    }
  };
  return getRedirect();
};

export default GoogleCallback;
