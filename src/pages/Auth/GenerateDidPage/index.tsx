import React, { useEffect } from 'react';
import { StaticContext, RouteComponentProps, useHistory } from 'react-router';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, LocationState } from './types';
import { SubState } from 'src/store/users/types';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { AccountType } from 'src/services/user.service';

import { getUsersWithRegisteredEmail } from './fetchapi';
import { DidService } from 'src/services/did.service.new';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const GenerateDidPage: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const history = useHistory();

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

        let mnemonic = '';
        if (session.did && !session.did.startsWith('did:elastos:')) {
          session.did = '';
          session.service = AccountType.DID;
        } else {
          mnemonic = userService.getTemporaryMnemonicFromDid(session.did);
        }

        let sessionItem = await userService.CreateNewUser(
          session.name,
          session.service,
          session.loginCred,
          session.credential,
          session.did,
          mnemonic,
          ''
        );
        eProps.setSession({ session: sessionItem });
        history.push('/profile');
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

export default connect(mapStateToProps, mapDispatchToProps)(GenerateDidPage);
