/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';

import PageLoading from 'src/components/layouts/PageLoading';
import { TokenResponse } from './types';
import {
  requestFacebookId,
  requestFacebookToken,
  getUsersWithRegisteredFacebook
} from './fetchapi';
import { DidService } from 'src/services/did.service';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';

const FacebookCallback: React.FC<RouteComponentProps> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    name: '',
    loginCred: {
      facebook: ''
    }
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
      if (code !== '' && state !== '' && credentials.name === '') {
        let t = await getToken(code, state);
        let facebookId = await requestFacebookId(t.data.request_token);

        let userSession = UserService.GetUserSession();
        if (userSession) {
          let vc = await DidcredsService.generateVerifiableCredential(
            userSession.did,
            CredentialType.Facebook,
            facebookId.name
          );
          let state = await DidDocumentService.getUserDocument(userSession);
          await DidService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );
          DidDocumentService.updateUserDocument(state.diddocument);

          userSession.loginCred!.facebook! = facebookId.name;
          userSession.badges!.socialVerify!.facebook.archived = new Date().getTime();
          await UserService.updateSession(userSession);
          await ProfileService.addActivity(
            {
              guid: '',
              did: userSession.did,
              message: 'You received a Facebook verfication badge',
              read: false
            },
            userSession.did
          );

          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredFacebook(facebookId.name);
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: facebookId.name,
                loginCred: {
                  facebook: facebookId.name
                },
                service: AccountType.Facebook
              }
            });
          } else {
            setCredentials({
              name: facebookId.name,
              loginCred: {
                facebook: facebookId.name
              }
            });
          }
        }
      }
    })();
  }, []);

  const getRedirect = () => {
    if (credentials.name !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              loginCred: credentials.loginCred,
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
