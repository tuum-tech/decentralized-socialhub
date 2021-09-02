import React, { useEffect, useState } from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { SearchService } from 'src/services/search.service';
import { getItemsFromData } from 'src/utils/script';
import { ButtonWithLogo } from 'src/elements/buttons';
import { Text16, ErrorTxt } from 'src/elements/texts';
import whitelogo from 'src/assets/logo/whitetextlogo.png';
import eye from 'src/assets/icon/eye.png';
import TextInput from 'src/elements/inputs/TextInput';
import { UserService } from 'src/services/user.service';

import FieldDivider from '../FieldDivider';
import SelectUsers from './SelectUsers';
import { DidService } from 'src/services/did.service.new';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

interface Props {
  changeMode: () => void;
  afterSuccess: (session: ISessionItem) => void;
  dids: Array<string>;
  removeUser: (did: string) => void;
}

const MultiDidPasswordLogin: React.FC<Props> = ({
  dids,
  changeMode,
  removeUser,
  afterSuccess
}) => {
  const [did, setDid] = useState(dids[0]);
  const [localUsers, setLocalUsers] = useState([]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');

  useEffect(() => {
    (async () => {
      const searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
      let getUserRes: any = await searchServiceLocal.getUsersByDIDs(
        dids,
        200,
        0
      );
      const users = getItemsFromData(getUserRes, 'get_users_by_dids');
      if (users.length > 0) {
        setLocalUsers(users);
        setLoading('');
      }
    })();
  }, [dids]);

  const onLoginButtonClick = async () => {
    if (!password || password === '') {
      setError('Enter your password');
      return;
    }
    setLoading('Signing now...');

    let userService = new UserService(await DidService.getInstance());

    const res = await userService.UnLockWithDIDAndPwd(did, password);
    if (res) {
      afterSuccess(res);
      return;
    }

    setLoading('');
  };

  return (
    <OnBoardLayout>
      {loading !== '' && <LoadingIndicator loadingText={loading} />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            We have seen your accounts before.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            You can select and login using the password you set
          </OnBoardLayoutLeftContentDescription>
          <Footer>
            <FooterLinks></FooterLinks>
          </Footer>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign in using the previous logged info
          </OnBoardLayoutRightContentTitle>
          <Text16>Decentralized Identity (DID):</Text16>
          {localUsers && localUsers.length > 0 && (
            <SelectUsers
              users={localUsers}
              selectDID={(did: string) => setDid(did)}
              removeUser={removeUser}
            />
          )}
          <TextInput
            value={password}
            type="password"
            label="Password"
            onChange={n => {
              setError('');
              setPassword(n);
            }}
            onHitEnter={async () => {
              await onLoginButtonClick();
            }}
            placeholder="Enter your password"
            hasError={error !== '' && password === ''}
          />
          {error !== '' && <ErrorTxt className="mt-3">{error}</ErrorTxt>}
          <ButtonWithLogo
            mode="dark"
            mt={20}
            text="Sign in to profile"
            onClick={async () => {
              await onLoginButtonClick();
            }}
          />

          <FieldDivider mt={80} />
          <ButtonWithLogo
            text="Create new profile"
            onClick={changeMode}
            mt={42}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default MultiDidPasswordLogin;
