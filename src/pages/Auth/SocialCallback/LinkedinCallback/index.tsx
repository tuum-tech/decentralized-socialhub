/**
 * Page
 */

import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';

import { AccountType, UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';

import { TokenResponse } from './types';
import {
  requestLinkedinProfile,
  requestLinkedinToken,
  getUsersWithRegisteredLinkedin
} from './fetchapi';
import { DidService } from 'src/services/did.service';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';

const LinkedinCallback: React.FC<RouteComponentProps> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    name: '',
    loginCred: {
      linkedin: ''
    }
  });
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
      if (
        code !== '' &&
        state !== '' &&
        credentials.loginCred.linkedin === ''
      ) {
        let t = await getToken(code, state);
        let linkedinprofile: any = await requestLinkedinProfile(
          t.data.request_token
        );
        if (!linkedinprofile || !linkedinprofile.data) return;
        console.log('aui');
        const firstName = linkedinprofile.data.profile.localizedFirstName.toLowerCase();
        const lastName = linkedinprofile.data.profile.localizedLastName.toLowerCase();

        let userSession = UserService.GetUserSession();
        debugger;
        if (userSession) {
          console.log('entrou aqui');
          let vc = await DidcredsService.generateVerifiableCredential(
            userSession.did,
            CredentialType.Linkedin,
            firstName + '' + lastName
          );

          let state = await DidDocumentService.getUserDocument(userSession);

          await DidService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );

          DidDocumentService.updateUserDocument(state.diddocument);

          userSession.loginCred!.linkedin! = firstName + '' + lastName;
          if (!userSession.badges!.socialVerify!.linkedin.archived) {
            userSession.badges!.socialVerify!.linkedin.archived = new Date().getTime();
            await ProfileService.addActivity(
              {
                guid: '',
                did: userSession.did,
                message: 'You received a Linkedin verfication badge',
                read: false,
                createdAt: 0,
                updatedAt: 0
              },
              userSession.did
            );
          }
          await UserService.updateSession(userSession);
          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredLinkedin(
            firstName + '' + lastName
          );
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: firstName + ' ' + lastName,
                loginCred: {
                  linkedin: firstName + '' + lastName
                },
                service: AccountType.Linkedin
              }
            });
          } else {
            setCredentials({
              name: firstName + ' ' + lastName,
              loginCred: {
                linkedin: firstName + '' + lastName
              }
            });
          }
        }
      }
    })();
  });

  const getRedirect = () => {
    if (credentials.loginCred.linkedin !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              service: AccountType.Linkedin,
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

export default LinkedinCallback;
