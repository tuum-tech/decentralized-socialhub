import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { StaticContext, RouteComponentProps, useHistory } from 'react-router';

import { UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType } from 'src/services/user.service';
import SetPassword from '../components/SetPassword';

import { InferMappedProps, LocationState, UserSessionProp } from './types';
import { getUsersWithRegisteredEmail } from './fetchapi';
import { setSession } from 'src/store/users/actions';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const GenerateDidPage: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const history = useHistory();

  const [loading, setLoading] = useState(false);
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

  if (session && session.name) {
    return (
      <SetPassword
        loading={loading}
        next={async pwd => {
          if (!session || !session.name) return;
          setLoading(true);
          const sessionItem = await UserService.CreateNewUser(
            session.name,
            session.service,
            session.loginCred,
            session.credential,
            pwd,
            '',
            '',
            ''
          );
          eProps.setSession({ session: sessionItem });
          window.location.href = '/profile';
          setLoading(false);
        }}
      />
    );
  }

  return <PageLoading />;
};

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapDispatchToProps)(GenerateDidPage);
