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
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout';

import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo';
import TextInput from 'src/components/inputs/TextInput';
import { Text16 } from 'src/components/texts';

import whitelogo from '../../../../assets/logo/whitetextlogo.png';
import keyimg from '../../../../assets/icon/key.png';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

const CreateProfile: React.FC = () => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={keyimg} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            Your password is not stored by us.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            This is a locally stored password. This password protects your main
            profile account (decentralized identity).
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            More information on why I need a password? Help
          </OnBoardLayoutLeftContentIntro>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle style={{ marginBottom: '46px' }}>
            Create your profile
          </OnBoardLayoutRightContentTitle>
          <TextInput
            value={password}
            label='Password'
            onChange={(n) => {
              setError('');
              setPassword(n);
            }}
            placeholder='Enter your password'
          />
          <TextInput
            value={repeatPassword}
            label='Re-enter Password'
            onChange={(n) => {
              setError('');
              setRepeatPassword(n);
            }}
            placeholder='Enter your password'
          />

          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text='Continue'
            onClick={() => {
              if (password === '' || repeatPassword === '') {
                setError('You should fill the input fields');
              } else if (password !== repeatPassword) {
                setError('Password is different');
              } else {
              }
            }}
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
