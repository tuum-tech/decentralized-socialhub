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

import { useRecoilValue } from 'recoil';
import { CallbackFromAtom } from 'src/Atoms/Atoms';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { TokenResponse, LocationState, InferMappedProps } from './types';
import { SubState } from 'src/store/users/types';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import { AccountType, UserService } from 'src/services/user.service';

import { requestDiscordToken, getUsersWithRegisteredDiscord } from './fetchapi';
import { ProfileService } from 'src/services/profile.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidService } from 'src/services/did.service.new';
import { VerificationService } from 'src/services/verification.service';
import { SpaceService } from 'src/services/space.service';

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
  const { session } = props;
  const history = useHistory();
  const callbackFrom = useRecoilValue(CallbackFromAtom);
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
      let didService = await DidService.getInstance();
      if (!code) return;
      let t = await getToken(code);
      let discord = t.data.username + '#' + t.data.discriminator;
      if (callbackFrom) {
        // social callback from space dashboard
        const space: any = callbackFrom;
        await SpaceService.addSpace(session, {
          ...space,
          socialLinks: { ...space.socialLinks, discord }
        });
        window.close();
      } else {
        if (credentials.loginCred.discord === '') {
          if (session && session.did !== '') {
            let verifiableCredential = await DidcredsService.generateVerifiableCredential(
              session.did,
              CredentialType.Discord,
              discord
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
                newSession.did
              );
            }
            let userService = new UserService(didService);
            eProps.setSession({
              session: await userService.updateSession(newSession)
            });

            window.close();
          } else {
            setCredentials({
              name: discord,
              loginCred: {
                discord: discord
              }
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
    let loadingText = session.isEssentialUser
      ? 'Please accept Credential Import on Essentials App'
      : '';
    return <LoadingIndicator loadingText={loadingText} />;
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
