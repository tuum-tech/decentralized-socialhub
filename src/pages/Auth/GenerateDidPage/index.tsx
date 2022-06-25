import React, { useEffect } from 'react';
import { StaticContext, RouteComponentProps, useHistory } from 'react-router';

import { LocationState } from './types';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { AccountType } from 'src/services/user.service';
import useSession from 'src/hooks/useSession';

import { getUsersWithRegisteredEmail } from './fetchapi';
import { DidService } from 'src/services/did.service.new';

interface PageProps
  extends RouteComponentProps<{}, StaticContext, LocationState> {}

const GenerateDidPage: React.FC<PageProps> = (props: PageProps) => {
  const history = useHistory();
  const { setSession } = useSession();

  useEffect(() => {
    (async () => {
      if (props.location.state && props.location.state.service) {
        const { service } = props.location.state;
        if (
          service !== AccountType.Email &&
          service !== AccountType.DID &&
          props.location.state.loginCred.email
        ) {
          const pUsers = await getUsersWithRegisteredEmail(
            props.location.state.loginCred.email
          );
          if (pUsers.length > 0) {
            history.push({
              pathname: '/associated-profile',
              state: {
                users: pUsers,
                name: props.location.state.name,
                loginCred: props.location.state.loginCred,
                service: props.location.state.service,
                credential: props.location.state.credential
              }
            });
          }
        }

        //
        const session = props.location.state;
        let userService = new UserService(await DidService.getInstance());

        if (session.did && !session.did.startsWith('did:elastos:')) {
          session.did = '';
          session.service = AccountType.DID;
        }

        let sessionItem = await userService.CreateNewUser(
          session.name,
          session.service,
          session.loginCred,
          session.credential,
          session.did,
          '',
          '',
          ''
        );
        setSession(sessionItem);
        history.push('/profile');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingIndicator />;
};

export default GenerateDidPage;
