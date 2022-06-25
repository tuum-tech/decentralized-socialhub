import React, { useEffect, useState } from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';
import { AccountType, UserService } from 'src/services/user.service';
import { useHistory } from 'react-router-dom';

import { DidService } from 'src/services/did.service.new';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { retrieveDocInfo, UserType } from 'src/utils/user';

import { LocationState } from './types';
import ProfileFields from './components/ProfileFields';
import useSession from 'src/hooks/useSession';

interface PageProps
  extends RouteComponentProps<{}, StaticContext, LocationState> {}

const CreateProfileWithDidPage: React.FC<PageProps> = (props: PageProps) => {
  const { setSession } = useSession();
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
        setSession(sessionItem);
        history.push('/profile');
      }}
    />
  );
};

export default CreateProfileWithDidPage;
