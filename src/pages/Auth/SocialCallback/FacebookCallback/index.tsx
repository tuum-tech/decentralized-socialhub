/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';

import PageLoading from 'src/components/layouts/PageLoading';
import { TokenResponse } from './types';
import { requestFacebookId, requestFacebookToken, getUsersWithRegisteredFacebook } from './fetchapi';
import { DidService } from 'src/services/did.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { TuumTechScriptService } from 'src/services/script.service';

const FacebookCallback: React.FC<RouteComponentProps> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    email: '',
    name: '',
    request_token: '',
    credential: ''
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

        let userSession = UserService.GetUserSession()
        if (userSession) {

          let vc = await DidcredsService.generateVerifiableCredential(userSession.did, CredentialType.Facebook, facebookId.name)
          let state = await DidDocumentService.getUserDocument(userSession)
          await DidService.addVerfiableCredentialToDIDDocument(state.diddocument, vc)
          DidDocumentService.updateUserDocument(state.diddocument)

          userSession.loginCred!.facebook! = facebookId.name
          UserService.updateSession(userSession)

          window.close();
        } else {

          let prevUsers = await getUsersWithRegisteredFacebook(facebookId.name)
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: facebookId.name,
                email: facebookId.email,
                request_token: '',
                service: AccountType.Facebook,
                credential: facebookId.name
              }
            });
          } else {
            setCredentials({
              name: facebookId.name,
              request_token: t.data.request_token,
              email: facebookId.email,
              credential: facebookId.name
            });
          }


        }


      }
    })();
  }, []);

  const getRedirect = () => {
    if (credentials.request_token !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              request_token: credentials.request_token,
              email: credentials.email,
              credential: credentials.credential,
              service: AccountType.Facebook
            }
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default FacebookCallback;
