import React, { useState, useEffect } from 'react';
import {
  StaticContext,
  Redirect,
  RouteComponentProps,
  useHistory
} from 'react-router';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, LocationState, UserSessionProp } from './types';
import { SubState } from 'src/store/users/types';

import { UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType } from 'src/services/user.service';

import SetPassword from '../components/SetPassword';
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

  const [status, setStatus] = useState(0);
  const [session, setSession] = useState<UserSessionProp | null>(null);

  useEffect(() => {
    (async () => {
      if (!session && props.location.state && props.location.state.service) {
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
        setSession(props.location.state);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (status === 2) {
    return <Redirect to="/profile" />;
  }

  if (session && session.name) {
    return (
      <SetPassword
        loading={status === 1}
        next={async pwd => {
          if (!session || !session.name) return;
          setStatus(1);
          let userService = new UserService(await DidService.getInstance());
          let sessionItem = await userService.CreateNewUser(
            session.name,
            session.service,
            session.loginCred,
            session.credential,
            pwd,
            did,
            mnemonic,
            ''
          );
          eProps.setSession({ session: sessionItem });
          setStatus(2);
        }}
      />
    );
  }

  return <PageLoading />;
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
