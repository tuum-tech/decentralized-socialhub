/**
 * Page
 */

import React, { useState } from 'react';
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
import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo';
import TextInput from 'src/components/inputs/TextInput';
import { Text16 } from 'src/components/texts';
import LoadingIndicator from 'src/components/LoadingIndicator';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import keyimg from 'src/assets/icon/key.png';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

interface Props {
  next: (password: string) => void;
  displayText?: string;
  loading?: boolean;
}

const SetPassword: React.FC<Props> = ({
  next,
  displayText = '',
  loading = false
}) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const disabled = displayText !== '';

  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Encrypting Now..." />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={keyimg} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            Your password is not stored by us
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            This is a locally stored password that protects your main profile
            account (decentralized identity).
          </OnBoardLayoutLeftContentDescription>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle style={{ marginBottom: '46px' }}>
            Create your password
          </OnBoardLayoutRightContentTitle>
          <TextInput
            value={password}
            label="Password"
            type="password"
            onChange={n => {
              setError('');
              setPassword(n);
            }}
            placeholder="Enter your password"
          />
          <TextInput
            value={repeatPassword}
            type="password"
            label="Re-enter Password"
            onChange={n => {
              setError('');
              setRepeatPassword(n);
            }}
            placeholder="Enter your password"
          />

          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text={displayText !== '' ? displayText : 'Continue'}
            onClick={() => {
              if (disabled) return;
              if (password === '' || repeatPassword === '') {
                setError('You should fill the input fields');
              } else if (password !== repeatPassword) {
                setError('Password is different');
              } else {
                next(password);
              }
            }}
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default SetPassword;
