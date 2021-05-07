import React, { memo, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { StaticContext, RouteComponentProps, useHistory } from 'react-router';
import { compose } from 'redux';

import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { UserService } from 'src/services/user.service';
import PageLoading from 'src/components/layouts/PageLoading';
import { AccountType } from 'src/services/user.service';
// import LoadingIndicator from 'src/components/LoadingIndicator';

import SetPassword from '../components/SetPassword';

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import {
  InferMappedProps,
  SubState,
  LocationState,
  UserSessionProp
} from './types';
import { getUsersWithRegisteredEmail } from './fetchapi';

const GenerateDidPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

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
          await UserService.CreateNewUser(
            session.name,
            session.service,
            session.loginCred,
            session.credential,
            pwd,
            '',
            '',
            ''
          );
          window.location.href = '/profile';
          setLoading(false);
        }}
      />
    );
  }

  return <PageLoading />;
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(GenerateDidPage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
