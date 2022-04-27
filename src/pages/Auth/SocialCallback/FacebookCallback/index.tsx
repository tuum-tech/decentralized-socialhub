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
import { AccountType, UserService } from 'src/services/user.service';

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

import LoadingIndicator from 'src/elements/LoadingIndicator';

import {
  requestFacebookId,
  requestFacebookToken,
  getUsersWithRegisteredFacebook
} from './fetchapi';
import { DidService } from 'src/services/did.service.new';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { VerificationService } from 'src/services/verification.service';
import { SpaceService } from 'src/services/space.service';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const FacebookCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const { session } = props;
  const history = useHistory();
  const callbackFrom = useRecoilValue(CallbackFromAtom);
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
      let didService = await DidService.getInstance();
      if (!code || !state) return;
      let t = await getToken(code, state);
      let facebookId = await requestFacebookId(t.data.request_token);
      if (callbackFrom) {
        // social callback from space dashboard
        const space: any = callbackFrom;
        await SpaceService.addSpace(session, {
          ...space,
          socialLinks: { ...space.socialLinks, facebook: facebookId.name }
        });
        window.close();
      } else {
        if (credentials.name === '') {
          if (props.session && props.session.did !== '') {
            let verifiableCredential = await DidcredsService.generateVerifiableCredential(
              props.session.did,
              CredentialType.Facebook,
              facebookId.name
            );

            await DidcredsService.addOrUpdateCredentialToVault(
              props.session,
              verifiableCredential
            );

            const vService = new VerificationService();
            await vService.importCredential(verifiableCredential);

            let newSession = JSON.parse(JSON.stringify(props.session));
            newSession.loginCred!.facebook! = facebookId.name;
            if (!newSession.badges!.socialVerify!.facebook.archived) {
              newSession.badges!.socialVerify!.facebook.archived = new Date().getTime();
              await ProfileService.addActivity(
                {
                  guid: '',
                  did: newSession.did,
                  message: 'You received a Facebook verfication badge',
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
            let prevUsers = await getUsersWithRegisteredFacebook(
              facebookId.name
            );
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
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return (
      <LoadingIndicator loadingText="Please accept Credential Import on Essentials App" />
    );
  };
  return getRedirect();
};

// export default FacebookCallback;

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

export default connect(mapStateToProps, mapDispatchToProps)(FacebookCallback);
