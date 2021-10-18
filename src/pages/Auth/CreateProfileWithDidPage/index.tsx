import React, { useEffect, useState } from 'react';
import { StaticContext, RouteComponentProps, Redirect } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setSession } from 'src/store/users/actions';
import { makeSelectSession } from 'src/store/users/selectors';

import { DidService } from 'src/services/did.service.new';
import PageLoading from 'src/components/layouts/PageLoading';
import { retrieveDocInfo, UserType } from 'src/utils/user';
import SetPassword from '../components/SetPassword';
import { InferMappedProps, LocationState, SubState } from './types';
import ProfileFields from './components/ProfileFields';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const CreateProfileWithDidPage: React.FC<PageProps> = ({
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

  const [status, setStatus] = useState(0);

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
  } else {
    if (
      status === 0 &&
      userInfo.name !== '' &&
      (!userInfo.loginCred.email || userInfo.loginCred.email === '')
    ) {
      setStatus(1);
    }

    if (status === 1) {
      return (
        <SetPassword
          loading={false}
          next={async pwd => {
            let userService = new UserService(await DidService.getInstance());
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
            setStatus(3);
          }}
        />
      );
    }

    if (status === 3) {
      return <Redirect to="/profile" />;
    }

    return (
      <ProfileFields
        isCreate={false}
        userInfo={userInfo}
        setUserInfo={(name, email) => {
          setUserInfo({
            ...userInfo,
            name,
            loginCred: {
              ...userInfo.loginCred,
              email
            }
          });
          setStatus(1);
        }}
      />
    );
  }
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

export default connect(null, mapDispatchToProps)(CreateProfileWithDidPage);
