/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { AccountType } from 'src/services/user.service';

import PageLoading from 'src/components/layouts/PageLoading';
import { TokenResponse } from './types';
import { requestFacebookId, requestFacebookToken } from './fetchapi';

const FacebookCallback: React.FC<RouteComponentProps> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [credentials, setCredentials] = useState({
    id: '',
    email: '',
    fname: '',
    lname: '',
    request_token: '',
    credential: '',
  });
  const getToken = async (
    code: string,
    state: string
  ): Promise<TokenResponse> => {
    return (await requestFacebookToken(code, state)) as TokenResponse;
  };

  let code: string =
    new URLSearchParams(props.location.search).get('code') || '';
  let state: string =
    new URLSearchParams(props.location.search).get('state') || '';

  useEffect(() => {
    (async () => {
      if (code !== '' && state !== '' && credentials.request_token === '') {
        let t = await getToken(code, state);
        let facebookId = await requestFacebookId(t.data.request_token);
        console.log('facebook data', facebookId);
        setCredentials({
          id: facebookId.id,
          fname: facebookId.fname,
          lname: facebookId.lname,
          request_token: t.data.request_token,
          email: facebookId.email,
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
              fname: credentials.fname,
              lname: credentials.lname,
              request_token: credentials.request_token,
              email: credentials.email,
              credential: credentials.credential,
              service: AccountType.Facebook,
            },
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default withRouter(FacebookCallback);
