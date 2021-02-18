/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';

import { TokenResponse } from './types';
import { requestFacebookId, requestFacebookToken } from './fetchapi';
import { UserService } from 'src/services/user.service';

const FacebookCallback: React.FC<RouteComponentProps> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [isLogged, setisLogged] = useState(false);
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
      if (code !== '' && state !== '') {
        let t = await getToken(code, state);
        let facebookId = await requestFacebookId(t.data.request_token);

        console.log('facebook data', facebookId);

        await UserService.SignInWithFacebook(
          facebookId.id,
          facebookId.name,
          t.data.request_token,
          facebookId.credential
        );

        setisLogged(true);
      }
    })();
  });

  const getRedirect = () => {
    if (isLogged) {
      return <Redirect to={{ pathname: '/profile' }} />;
    } else return <div></div>;
  };
  return getRedirect();
};

export default withRouter(FacebookCallback);
