/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import {
  Redirect,
  RouteComponentProps,
  StaticContext,
  useHistory
} from 'react-router';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { TokenResponse, LocationState, InferMappedProps } from './types';
import { SubState } from 'src/store/users/types';

import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType, UserService } from 'src/services/user.service';

import { requestDiscordToken, getUsersWithRegisteredDiscord } from './fetchapi';
import { ProfileService } from 'src/services/profile.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DidService } from 'src/services/did.service';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

// const DiscordCallback: React.FC<RouteComponentProps> = props => {
const DiscordCallback: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const history = useHistory();
  const [credentials, setCredentials] = useState({
    loginCred: {
      discord: ''
    },
    name: ''
  });
  const getToken = async (code: string): Promise<TokenResponse> => {
    return (await requestDiscordToken(code)) as TokenResponse;
  };

  let code: string =
    new URLSearchParams(props.location.search).get('code') || '';

  useEffect(() => {
    (async () => {
      if (code !== '' && credentials.loginCred.discord === '') {
        let t = await getToken(code);
        let discord = t.data.username + '#' + t.data.discriminator;

        if (props.session && props.session.did !== '') {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Discord,
            discord
          );
          let state = await DidDocumentService.getUserDocument(props.session);
          await DidService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );
          DidDocumentService.updateUserDocument(state.diddocument);

          let newSession = JSON.parse(JSON.stringify(props.session));
          newSession.loginCred!.discord! = discord;
          if (!newSession.badges!.socialVerify!.discord.archived) {
            newSession.badges!.socialVerify!.discord.archived = new Date().getTime();
            await ProfileService.addActivity(
              {
                guid: '',
                did: newSession.did,
                message: 'You received a Discord verfication badge',
                read: false,
                createdAt: 0,
                updatedAt: 0
              },
              newSession
            );
          }
          // await UserService.updateSession(userSession);
          eProps.setSession({
            session: await UserService.updateSession(newSession)
          });
          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredDiscord(discord);
          const loginCred = {
            discord: discord
          };
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: discord,
                service: AccountType.Discord,
                loginCred
              }
            });
          } else {
            setCredentials({
              name: discord,
              loginCred
            });
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRedirect = () => {
    if (credentials.loginCred.discord !== '') {
      return (
        <Redirect
          to={{
            pathname: '/generate-did',
            state: {
              name: credentials.name,
              loginCred: credentials.loginCred,
              service: AccountType.Discord
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

export default connect(mapStateToProps, mapDispatchToProps)(DiscordCallback);
