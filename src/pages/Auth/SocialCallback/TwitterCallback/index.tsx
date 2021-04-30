/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';

import PageLoading from 'src/components/layouts/PageLoading';
import { DidService } from 'src/services/did.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { TuumTechScriptService } from 'src/services/script.service';
import { AccountType, UserService } from 'src/services/user.service';

import { requestTwitterToken, getUsersWithRegisteredTwitter } from './fetchapi';
import { TokenResponse } from './types';

const TwitterCallback: React.FC<RouteComponentProps> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    name: '',
    loginCred: {
      twitter: ''
    }
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
        credentials.loginCred.twitter === ''
      ) {
        let t = await getToken(oauth_token, oauth_verifier);
        let items: string[] = atob(t.data.response).split(';');
        const name = items[0];

        let userSession = UserService.GetUserSession();
        if (userSession) {
          let vc = await DidcredsService.generateVerifiableCredential(
            userSession.did,
            CredentialType.Twitter,
            items[1].toString()
          );

          let state = await DidDocumentService.getUserDocument(userSession);

          await DidService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );

          DidDocumentService.updateUserDocument(state.diddocument);

          userSession.loginCred!.twitter! = items[1].toString();
          userSession.badges!.socialVerify!.twitter.archived = new Date().getTime();
          await UserService.updateSession(userSession);

          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredTwitter(
            items[1].toString()
          );
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: items[0].toString(),
                service: AccountType.Twitter,
                loginCred: {
                  twitter: items[1].toString()
                }
              }
            });
          } else {
            setCredentials({
              name,
              loginCred: {
                twitter: items[1].toString()
              }
            });
          }
        }
      }
    })();
  });

  const getRedirect = () => {
    if (credentials.loginCred.twitter !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              loginCred: credentials.loginCred,
              service: AccountType.Twitter
            }
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default TwitterCallback;
