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

import LoadingIndicator from 'src/elements/LoadingIndicator';
import { AccountType, UserService } from 'src/services/user.service';

import { requestDiscordToken, getUsersWithRegisteredDiscord } from './fetchapi';
import { ProfileService } from 'src/services/profile.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidService } from 'src/services/did.service.new';
import { VerificationService } from 'src/services/verification.service';

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

  const getToken = async (code: string): Promise<TokenResponse> => {
    return (await requestDiscordToken(code)) as TokenResponse;
  };

  let code: string =
    new URLSearchParams(props.location.search).get('code') || '';

  useEffect(() => {
    (async () => {
      let didService = await DidService.getInstance();
      let userService = new UserService(didService);
      if (code !== '') {
        let t = await getToken(code);
        let discord = t.data.username + '#' + t.data.discriminator;

        if (props.session && props.session.did !== '') {
          let verifiableCredential = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Discord,
            discord
          );

          await DidcredsService.addOrUpdateCredentialToVault(
            props.session,
            verifiableCredential
          );

          const vService = new VerificationService();
          await vService.importCredential(verifiableCredential);

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
              newSession.did
            );
          }

          eProps.setSession({
            session: await userService.updateSession(newSession)
          });

          window.close();
        } else {
          let prevUsers = await getUsersWithRegisteredDiscord(discord);
          if (prevUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: prevUsers,
                name: discord,
                loginCred: {
                  discord: discord
                },
                service: AccountType.Discord
              }
            });
          } else {
            await userService.CreateNewUser(
              discord, // name
              AccountType.Discord, // service
              {
                discord
              }, // logincred
              '',
              '',
              '',
              '',
              ''
            );
            history.push('/profile');
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingIndicator />;
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
