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

import { useRecoilValue } from 'recoil';
import { CallbackFromAtom } from 'src/Atoms/Atoms';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { TokenResponse, LocationState, InferMappedProps } from './types';
import { SubState } from 'src/store/users/types';

import { AccountType, UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';

import { requestGithubToken, getUsersWithRegisteredGithub } from './fetchapi';
import { DidService } from 'src/services/did.service.new';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { VerificationService } from 'src/services/verification.service';
import { SpaceService } from 'src/services/space.service';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const GithubCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const { session } = props;
  const history = useHistory();
  const callbackFrom = useRecoilValue(CallbackFromAtom);
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

  useEffect(() => {
    (async () => {
      let didService = await DidService.getInstance();
      if (!code) return;
      let t = await getToken(code);
      let github = t.data.login;
      if (callbackFrom) {
        // social callback from space dashboard
        const space: any = callbackFrom;
        await SpaceService.addSpace(session, {
          ...space,
          socialLinks: { ...space.socialLinks, github }
        });
        window.close();
      } else {
        if (credentials.loginCred.github === '') {
          if (session && session.did !== '') {
            let verifiableCredential = await DidcredsService.generateVerifiableCredential(
              session.did,
              CredentialType.Github,
              github
            );

            // await DidcredsService.addOrUpdateCredentialToVault(
            //   session,
            //   verifiableCredential
            // );

            const vService = new VerificationService();
            await vService.importCredential(verifiableCredential);

            let newSession = JSON.parse(JSON.stringify(session));
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
    return (
      <LoadingIndicator loadingText="Please accept Credential Import on Essentials App" />
    );
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
