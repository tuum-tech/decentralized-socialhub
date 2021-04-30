/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';

import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType, UserService } from 'src/services/user.service';

import { TokenResponse } from './types';
import {
  requestGoogleId,
  requestGoogleToken,
  getUsersWithRegisteredGoogle
} from './fetchapi';
import { AssistService } from 'src/services/assist.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DidService } from 'src/services/did.service';
import { TuumTechScriptService } from 'src/services/script.service';

const GoogleCallback: React.FC<RouteComponentProps> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    loginCred: {
      google: '',
      email: ''
    },
    name: ''
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
      if (code !== '' && state !== '' && credentials.loginCred.google === '') {
        let t = await getToken(code, state);
        let googleId = await requestGoogleId(t.data.request_token);

        let userSession = UserService.GetUserSession();
        if (userSession) {
          let vc = await DidcredsService.generateVerifiableCredential(
            userSession.did,
            CredentialType.Google,
            googleId.email
          );

          let state = await DidDocumentService.getUserDocument(userSession);

          await DidService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );

          DidDocumentService.updateUserDocument(state.diddocument);
          userSession.loginCred!.google! = googleId.email;
          userSession.badges!.socialVerify!.google.archived = new Date().getTime();
          await UserService.updateSession(userSession);
          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredGoogle(googleId.email);
          const loginCred = {
            email: googleId.email,
            google: googleId.name
          };
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: googleId.name,
                service: AccountType.Google,
                loginCred
              }
            });
          } else {
            setCredentials({
              name: googleId.name,
              loginCred
            });
          }
        }
      }
    })();
  }, []);

  const getRedirect = () => {
    if (credentials.loginCred.google !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              loginCred: credentials.loginCred,
              service: AccountType.Google
            }
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default GoogleCallback;
