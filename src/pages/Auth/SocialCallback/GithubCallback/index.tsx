/**
 * Page
 */

import React, { useEffect, useState } from 'react';
import {
  Redirect,
  RouteComponentProps,
  useHistory,
  StaticContext
} from 'react-router';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { TokenResponse, LocationState, InferMappedProps } from './types';
import { SubState } from 'src/store/users/types';

import { AccountType, UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';

import { requestGithubToken, getUsersWithRegisteredGithub } from './fetchapi';
import { DidService } from 'src/services/did.service';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const GithubCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
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

        if (props.session) {
          console.log('entrou aqui');
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Github,
            github
          );

          let state = await DidDocumentService.getUserDocument(props.session);

          await didService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );
          DidDocumentService.updateUserDocument(state.diddocument);

          let newSession = JSON.parse(JSON.stringify(props.session));
          newSession.loginCred!.github! = github;
          if (!newSession.badges!.socialVerify!.github.archived) {
            newSession.badges!.socialVerify!.github.archived = new Date().getTime();
            await ProfileService.addActivity(
              {
                guid: '',
                did: newSession.did,
                message: 'You received a Github verfication badge',
                read: false,
                createdAt: 0,
                updatedAt: 0
              },
              newSession.did
            );
          }
             let userService = new UserService(didService);
          eProps.setSession({
            session: await userService.updateSession(newSession)
          });
       
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

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(GithubCallback);
