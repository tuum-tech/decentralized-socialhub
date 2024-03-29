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
import {
  TokenResponse,
  LocationState,
  InferMappedProps,
  SubState
} from './types';

import {
  requestGoogleId,
  requestGoogleToken,
  getUsersWithRegisteredGoogle
} from './fetchapi';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import { AccountType, UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidService } from 'src/services/did.service.new';
import { VerificationService } from 'src/services/verification.service';
import { SpaceService } from 'src/services/space.service';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const GoogleCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const { session } = props;
  const history = useHistory();
  const callbackFrom = useRecoilValue(CallbackFromAtom);
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
      let didService = await DidService.getInstance();
      if (!code || !state) return;
      let t = await getToken(code, state);
      let googleId = await requestGoogleId(t.data.request_token);
      if (callbackFrom) {
        // social callback from space dashboard
        const space: any = callbackFrom;
        await SpaceService.addSpace(session, {
          ...space,
          socialLinks: { ...space.socialLinks, google: googleId.email }
        });
        window.close();
      } else {
        if (credentials.loginCred.google === '') {
          if (session && session.did !== '') {
            let verifiableCredential = await DidcredsService.generateVerifiableCredential(
              session.did,
              CredentialType.Google,
              googleId.email
            );

            await DidcredsService.addOrUpdateCredentialToVault(
              session,
              verifiableCredential
            );

            if (session.isEssentialUser) {
              const vService = new VerificationService();
              await vService.importCredential(verifiableCredential);
            }

            let newSession = JSON.parse(JSON.stringify(session));
            newSession.loginCred!.google! = googleId.email;
            if (!newSession.badges!.socialVerify!.google.archived) {
              newSession.badges!.socialVerify!.google.archived = new Date().getTime();
              await ProfileService.addActivity(
                {
                  guid: '',
                  did: newSession.did,
                  message: 'You received a Google verfication badge',
                  read: false,
                  createdAt: 0,
                  updatedAt: 0
                },
                newSession
              );
            }
            let userService = new UserService(didService);
            eProps.setSession({
              session: await userService.updateSession(newSession)
            });

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
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [callbackFrom]);

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
    let loadingText = session.isEssentialUser
      ? 'Please accept Credential Import on Essentials App'
      : '';
    return <LoadingIndicator loadingText={loadingText} />;
  };
  return getRedirect();
};

// export default GoogleCallback;

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

export default connect(mapStateToProps, mapDispatchToProps)(GoogleCallback);
