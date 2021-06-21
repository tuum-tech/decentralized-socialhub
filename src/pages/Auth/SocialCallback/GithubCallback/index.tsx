/**
 * Page
 */

import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';

import { AccountType, UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';

import { TokenResponse } from './types';
import { requestGithubToken, getUsersWithRegisteredGithub } from './fetchapi';
import { DidService } from 'src/services/did.service';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { container } from 'tsyringe';

const GithubCallback: React.FC<RouteComponentProps> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    name: '',
    loginCred: {
      github: ''
    }
  });
  const getToken = async (code: string): Promise<TokenResponse> => {
    return (await requestGithubToken(code)) as TokenResponse;
  };

  let code: string =
    new URLSearchParams(props.location.search).get('code') || '';

  let didService = new DidService();
  useEffect(() => {
    (async () => {
      if (code !== '' && credentials.loginCred.github === '') {
        let t = await getToken(code);
        let github = t.data.login;

        let userSession = UserService.GetUserSession();
        debugger;
        if (userSession) {
          console.log('entrou aqui');
          let vc = await DidcredsService.generateVerifiableCredential(
            userSession.did,
            CredentialType.Github,
            github
          );

          let state = await DidDocumentService.getUserDocument(userSession);

          await didService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );

          DidDocumentService.updateUserDocument(state.diddocument);

          userSession.loginCred!.github! = github;
          if (!userSession.badges!.socialVerify!.github.archived) {
            userSession.badges!.socialVerify!.github.archived = new Date().getTime();
            await ProfileService.addActivity(
              {
                guid: '',
                did: userSession.did,
                message: 'You received a Github verfication badge',
                read: false,
                createdAt: 0,
                updatedAt: 0
              },
              userSession.did
            );
          }
          let userService = new UserService(new DidService());
          await userService.updateSession(userSession);
          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredGithub(github);
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: github,
                loginCred: {
                  github: github
                },
                service: AccountType.Github
              }
            });
          } else {
            setCredentials({
              name: github,
              loginCred: {
                github: github
              }
            });
          }
        }
      }
    })();
  });

  const getRedirect = () => {
    if (credentials.loginCred.github !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              service: AccountType.Github,
              loginCred: credentials.loginCred
            }
          }}
        />
      );
    }
    return <PageLoading />;
  };
  return getRedirect();
};

export default GithubCallback;
