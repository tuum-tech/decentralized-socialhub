/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, useHistory } from 'react-router';

import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType, UserService } from 'src/services/user.service';

import { TokenResponse } from './types';
import { requestDiscordToken, getUsersWithRegisteredDiscord } from './fetchapi';
import { ProfileService } from 'src/services/profile.service';
import { CredentialType, DidcredsService } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DidService } from 'src/services/did.service';
import { container } from 'tsyringe';

const DiscordCallback: React.FC<RouteComponentProps> = props => {
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

  let didService = new DidService();
  useEffect(() => {
    (async () => {
      if (code !== '' && credentials.loginCred.discord === '') {
        let t = await getToken(code);
        let discord = t.data.username + '#' + t.data.discriminator;
        console.log(discord, '===>discord id');
        let userSession = UserService.GetUserSession();
        if (userSession) {
          let vc = await DidcredsService.generateVerifiableCredential(
            userSession.did,
            CredentialType.Discord,
            discord
          );
          let state = await DidDocumentService.getUserDocument(userSession);

          await didService.addVerfiableCredentialToDIDDocument(
            state.diddocument,
            vc
          );

          DidDocumentService.updateUserDocument(state.diddocument);
          userSession.loginCred!.discord! = discord;
          if (!userSession.badges!.socialVerify!.discord.archived) {
            userSession.badges!.socialVerify!.discord.archived = new Date().getTime();
            await ProfileService.addActivity(
              {
                guid: '',
                did: userSession.did,
                message: 'You received a Discord verfication badge',
                read: false,
                createdAt: 0,
                updatedAt: 0
              },
              userSession.did
            );
          }
          let userService = new UserService(new DidService());
          await userService.updateSession(userSession);
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

export default DiscordCallback;
