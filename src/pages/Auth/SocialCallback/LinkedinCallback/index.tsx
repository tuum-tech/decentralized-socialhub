/**
 * Page
 */

import React, { useEffect, useState } from 'react';
import { TokenResponse } from './types';
import { requestLinkedinId, requestLinkedinToken } from './fetchapi';
import { Redirect, RouteComponentProps } from 'react-router-dom';

const LinkedinCallback: React.FC<RouteComponentProps> = (props) => {
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
    return (await requestLinkedinToken(code, state)) as TokenResponse;
  };

  let code: string =
    new URLSearchParams(props.location.search).get('code') || '';
  let state: string =
    new URLSearchParams(props.location.search).get('state') || '';

  useEffect(() => {
    (async () => {
      if (code !== '' && state !== '') {
        let t = await getToken(code, state);
        console.log('====>token', t);
        let linkedinId = await requestLinkedinId(t.data.request_token);
        console.log('====>linkedinId', linkedinId);
        // await UserService.SignInWithLinkedin(
        //   linkedinId.id,
        //   linkedinId.name,
        //   t.data.request_token,
        //   linkedinId.credential
        // );
        // setisLogged(true);
      }
    })();
  });

  const getRedirect = () => {
    if (isLogged) {
      return (
        <Redirect
          to={{
            pathname: '/profile',
          }}
        />
      );
    } else return <div></div>;
  };

  return getRedirect();
};

export default LinkedinCallback;
