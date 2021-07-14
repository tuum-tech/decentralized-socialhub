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

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import {
  TokenResponse,
  LocationState,
  InferMappedProps,
  SubState
} from './types';

import PageLoading from 'src/components/layouts/PageLoading';

import {
  requestFacebookId,
  requestFacebookToken,
  getUsersWithRegisteredFacebook
} from './fetchapi';
import { DidService } from 'src/services/did.service';
import { ProfileService } from 'src/services/profile.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/typings';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const FacebookCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
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

  let didService = new DidService();
  useEffect(() => {
    (async () => {
      if (code !== '' && state !== '' && credentials.name === '') {
        let t = await getToken(code, state);
        let facebookId = await requestFacebookId(t.data.request_token);

        if (props.session && props.session.did !== '') {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Facebook,
            facebookId.name
          );

          let state = await DidDocumentService.getUserDocument(props.session);
          await didService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );
          DidDocumentService.updateUserDocument(
            state.diddocument as DIDDocument
          );

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

          let userService = new UserService(new DidService());
          eProps.setSession({
            session: await userService.updateSession(newSession)
          });

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
    return <PageLoading />;
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
