import React, { useEffect, useState } from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';

import PageLoading from 'src/components/layouts/PageLoading';
import { retrieveDocInfo, UserType } from 'src/utils/user';

import ProfileFields from '../components/ProfileFields';
import SetPassword from '../components/SetPassword';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, LocationState, SubState } from './types';
import { makeSelectSession } from 'src/store/users/selectors';
import { DidService } from 'src/services/did.service.new';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const CreateProfileWithDidPageNew: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
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
        debugger;
        let sessionItem = await userService.CreateNewUser(
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
        eProps.setSession({ session: sessionItem });
        window.location.href = '/profile';
        setLoading(false);
      }}
    />
  );
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

export default connect(null, mapDispatchToProps)(CreateProfileWithDidPageNew);
