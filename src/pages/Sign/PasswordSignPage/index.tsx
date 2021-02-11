/**
 * Page
 */

import React, { useState } from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout';

import ButtonWithLogo from 'src/elements/buttons/ButtonWithLogo';
import TextInput from 'src/elements/inputs/TextInput';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import wavinghand from '../../../assets/icon/wavinghand.png';

const CreateProfile: React.FC = () => {
  const [password, setPassword] = useState('');

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            Continue with your password
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Forgot your password? Help
          </OnBoardLayoutLeftContentIntro>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle
            style={{ marginBottom: '46px', paddingTop: '120px' }}
          >
            Enter your password
          </OnBoardLayoutRightContentTitle>
          <TextInput
            value={password}
            label='Password'
            onChange={(n) => setPassword(n)}
            placeholder='Enter your password'
          />
          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text='Continue'
            onClick={() => {}}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
