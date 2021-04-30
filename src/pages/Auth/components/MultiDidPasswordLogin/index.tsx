import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

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
import LoadingIndicator from 'src/components/LoadingIndicator';
import { IUserResponse, SearchService } from 'src/services/search.service';
import Avatar from 'src/components/Avatar';

import { ButtonWithLogo } from 'src/components/buttons';
import { Text16, ErrorTxt } from 'src/components/texts';
import whitelogo from 'src/assets/logo/whitetextlogo.png';
import eye from 'src/assets/icon/eye.png';
import TextInput from 'src/components/inputs/TextInput';
import { UserService } from 'src/services/user.service';

import FieldDivider from '../FieldDivider';
import SelectUsers from './SelectUsers';

const DidSelectComp = styled.div`
  background: #edf2f7;
  border-radius: 6px;
  padding: 14.5px 16.5px;
  margin-top: 11px;

  font-weight: 500;
  font-size: 15px;
  line-height: 15px;
  color: #8492a6;

  select {
    border: none;
    outline: none;
    width: 100%;
    background: transparent;
  }
`;

interface Props {
  changeMode: () => void;
  dids: Array<string>;
}

const MultiDidPasswordLogin: React.FC<Props> = ({ dids, changeMode }) => {
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
      if (
        getUserRes &&
        getUserRes.response &&
        getUserRes.response.get_users &&
        getUserRes.response.get_users.items &&
        getUserRes.response.get_users.items.length > 0
      ) {
        setLocalUsers(getUserRes.response.get_users.items);
        setLoading('');
      }
    })();
  }, [dids]);

  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Signing now..." />}
      {localUsers.length === 0 && (
        <LoadingIndicator loadingText="Loading local users now..." />
      )}
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
              removeUser={async (did: string) => {}}
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
            placeholder="Enter your password"
            hasError={error !== '' && password === ''}
          />
          {error !== '' && <ErrorTxt className="mt-3">{error}</ErrorTxt>}
          <ButtonWithLogo
            mode="dark"
            mt={20}
            text="Sign in to profile"
            onClick={async () => {
              if (!password || password === '') {
                setError('Enter your password');
                return;
              }
              setLoading('Signing now...');
              const res = await UserService.UnLockWithDIDAndPwd(did, password);
              if (res) {
                window.location.href = '/profile';
              }
              setLoading('');
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
