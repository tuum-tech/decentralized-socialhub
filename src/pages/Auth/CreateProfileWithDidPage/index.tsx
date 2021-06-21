import React, { memo, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import { StaticContext, RouteComponentProps } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';

import PageLoading from 'src/components/layouts/PageLoading';
import { retrieveDocInfo, UserType } from 'src/utils/user';

import ProfileFields from '../components/ProfileFields';
import SetPassword from '../components/SetPassword';

import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import injector from 'src/baseplate/injectorWrap';
import { incrementAction, getSimpleAjax } from './actions';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState, LocationState } from './types';
import { DidService } from 'src/services/did.service';

const CreateProfileWithDidPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  const [userInfo, setUserInfo] = useState<UserType>({
    did: '',
    mnemonic: '',
    name: '',
    hiveHost: '',
    loginCred: {
      email: ''
    },
    avatar: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const uInfo = await retrieveDocInfo(
        props.location.state.did,
        props.location.state.mnemonic,
        props.location.state.user ? props.location.state.user.name : '',
        props.location.state.user?.loginCred
          ? props.location.state.user.loginCred.email
          : ''
      );
      setUserInfo(uInfo);
    };
    if (userInfo.did === '') {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userInfo.did === '') {
    return <PageLoading />;
  } else if (userInfo.name === '') {
    return (
      <ProfileFields
        isCreate={false}
        setUserInfo={(name, email) => {
          setUserInfo({
            ...userInfo,
            name,
            loginCred: {
              ...userInfo.loginCred,
              email
            }
          });
        }}
      />
    );
  }

  return (
    <SetPassword
      loading={loading}
      next={async pwd => {
        setLoading(true);
        let userService = new UserService(new DidService());
        await userService.CreateNewUser(
          userInfo.name,
          AccountType.DID,
          userInfo.loginCred,
          '',
          pwd,
          userInfo.did,
          userInfo.mnemonic,
          userInfo.hiveHost,
          userInfo.avatar
        );
        window.location.href = '/profile';
        setLoading(false);
      }}
    />
  );
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
const withInjectedMode = injector(CreateProfileWithDidPage, {
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
