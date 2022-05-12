import React, { useEffect, useState } from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';
import { useHistory } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { setSession } from 'src/store/users/actions';
import { makeSelectSession } from 'src/store/users/selectors';

import { DidService } from 'src/services/did.service.new';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { retrieveDocInfo, UserType } from 'src/utils/user';

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

  const history = useHistory();

  useEffect(() => {
    const fetchUserInfo = async () => {
      const { uInfo, experiences, educations } = await retrieveDocInfo(
        props.location.state.did,
        props.location.state.mnemonic,
        props.location.state.user ? props.location.state.user.name : '',
        props.location.state.user?.loginCred
          ? props.location.state.user.loginCred.email
          : ''
      );
      if (educations.length > 0) {
        window.localStorage.setItem(
          `temp_educations_${uInfo.did.replace('did:elastos:', '')}`,
          JSON.stringify(educations)
        );
      }
      if (experiences.length > 0) {
        window.localStorage.setItem(
          `temp_experiences_${uInfo.did.replace('did:elastos:', '')}`,
          JSON.stringify(experiences)
        );
      }
      setUserInfo(uInfo);
    };
    if (userInfo.did === '') {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (userInfo.did === '') {
    return <LoadingIndicator />;
  }

  return (
    <ProfileFields
      userInfo={userInfo}
      setUserInfo={async (name, email) => {
        const newUserInfo = {
          ...userInfo,
          name,
          loginCred: {
            ...userInfo.loginCred,
            email
          }
        };

        let userService = new UserService(await DidService.getInstance());
        let sessionItem = await userService.CreateNewUser(
          newUserInfo.name,
          AccountType.DID,
          newUserInfo.loginCred,
          '',
          newUserInfo.did,
          newUserInfo.mnemonic,
          newUserInfo.hiveHost,
          newUserInfo.avatar
        );
        eProps.setSession({ session: sessionItem });
        history.push('/profile');
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

export default connect(null, mapDispatchToProps)(CreateProfileWithDidPage);
