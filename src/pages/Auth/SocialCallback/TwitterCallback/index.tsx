/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType } from 'src/services/user.service';

import { requestTwitterToken } from './fetchapi';
import { TokenResponse } from './types';

const TwitterCallback: React.FC<RouteComponentProps> = (props) => {
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
    crednetial: '',
  });

  const getToken = async (
    oauth_token: string,
    oauth_verifier: string
  ): Promise<TokenResponse> => {
    return (await requestTwitterToken(
      oauth_token,
      oauth_verifier
    )) as TokenResponse;
  };

  let oauth_token: string =
    new URLSearchParams(props.location.search).get('oauth_token') || '';
  let oauth_verifier: string =
    new URLSearchParams(props.location.search).get('oauth_verifier') || '';

  useEffect(() => {
    (async () => {
      if (
        oauth_token !== '' &&
        oauth_verifier !== '' &&
        credentials.request_token === ''
      ) {
        let t = await getToken(oauth_token, oauth_verifier);
        let items: string[] = atob(t.data.response).split(';');
        const id = items[1];
        const name = items[0];
        const request_token = `${oauth_token}[-]${oauth_verifier}`;
        const crednetial = items[1];
        setCredentials({
          id,
          name,
          request_token,
          email: '',
          crednetial,
        });
      }
    })();
  });

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
              crednetial: credentials.crednetial,
              service: AccountType.Twitter,
            },
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default withRouter(TwitterCallback);
