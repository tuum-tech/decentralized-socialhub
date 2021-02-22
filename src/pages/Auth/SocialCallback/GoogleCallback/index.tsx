/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType } from 'src/services/user.service';

import { TokenResponse } from './types';
import { requestGoogleId, requestGoogleToken } from './fetchapi';

const GoogleCallback: React.FC<RouteComponentProps> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [credentials, setCredentials] = useState({
    id: '',
    email: '',
    name: '',
    request_token: '',
    credential: '',
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
          credential: '',
        });
      }
    })();
  }, []);

  const getRedirect = () => {
    if (credentials.request_token !== '') {
      return (
        <Redirect
          to={{
            pathname: '/social_login_success',
            state: {
              id: credentials.id,
              name: credentials.name,
              request_token: credentials.request_token,
              email: credentials.email,
              credential: credentials.credential,
              service: AccountType.Google,
            },
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default withRouter(GoogleCallback);
