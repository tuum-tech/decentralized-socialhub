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

import LoadingIndicator from 'src/elements/LoadingIndicator';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import {
  TokenResponse,
  LocationState,
  InferMappedProps,
  SubState
} from './types';

import {
  requestLinkedinProfile,
  requestLinkedinToken,
  getUsersWithRegisteredLinkedin
} from './fetchapi';
import { DidService } from 'src/services/did.service.new';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const LinkedinCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
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
      let didService = await DidService.getInstance();
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

        const firstName = linkedinprofile.data.profile.localizedFirstName.toLowerCase();
        const lastName = linkedinprofile.data.profile.localizedLastName.toLowerCase();

        if (props.session && props.session.did !== '') {
          let verifiableCredential = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Linkedin,
            firstName + '' + lastName
          );

          await DidcredsService.addOrUpdateCredentialToVault(
            props.session,
            verifiableCredential
          );

          let newSession = JSON.parse(JSON.stringify(props.session));
          newSession.loginCred!.linkedin! = firstName + '' + lastName;
          if (!newSession.badges!.socialVerify!.linkedin.archived) {
            newSession.badges!.socialVerify!.linkedin.archived = new Date().getTime();
            await ProfileService.addActivity(
              {
                guid: '',
                did: newSession.did,
                message: 'You received a Linkedin verfication badge',
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
    return <LoadingIndicator />;
  };
  return getRedirect();
};

// export default LinkedinCallback;

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

export default connect(mapStateToProps, mapDispatchToProps)(LinkedinCallback);
