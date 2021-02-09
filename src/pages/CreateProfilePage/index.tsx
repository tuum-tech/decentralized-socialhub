/**
 * Page
 */

import React, { useState } from 'react';

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

import ArrowButton from 'src/elements/buttons/ArrowButton';
import ButtonWithLogo from 'src/elements/buttons/ButtonWithLogo';
import SocialButton from 'src/elements/buttons/SocialButton';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/text';

import style from './style.module.scss';

import whitelogo from '../../assets/logo/whitetextlogo.png';
import wavinghand from '../../assets/icon/wavinghand.png';

const CreateProfile: React.FC = () => {
  const [fname, setFName] = useState('');
  const [lname, setLName] = useState('');
  const [email, setEmail] = useState('');

  return (
    <OnBoardLayout className={style['create-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            A better way to be online.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            Having multiple profiles is messy. Your personal information is
            copied and stored on every app. Profile gives you total control of
            your digital world, in one place. Finally unlock the power of your
            content online.
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Already have a profile? Sign in
          </OnBoardLayoutLeftContentIntro>
          <ArrowButton />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Create your profile
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '54px' }}>
            It’s free and easy to get set up.
          </Text16>
          <TextInput
            value={fname}
            label='First Name'
            onChange={(n) => setFName(n)}
            placeholder='Enter your first name'
          />
          <TextInput
            value={lname}
            label='Last Name'
            onChange={(n) => setLName(n)}
            placeholder='Enter your Last name'
          />
          <TextInput
            value={email}
            label='E-mail'
            onChange={(n) => setEmail(n)}
            placeholder='Enter your e-mail'
          />
          <ButtonWithLogo text='Create new profile' onClick={() => {}} />
          <div className={style['connect-divider']}>
            <hr className={style['connect-divider_line']} />
            <div className={style['connect-divider_txt']}>or connect with</div>
          </div>
          <div className={style['social-btn-group']}>
            <SocialButton type='linkedin' />
            <SocialButton type='google' />
            <SocialButton type='twitter' />
            <SocialButton type='facebook' />
          </div>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
