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
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/text';

import style from './style.module.scss';

import whitelogo from '../../assets/logo/whitetextlogo.png';
import eye from '../../assets/icon/eye.png';

const CreateProfile: React.FC = () => {
  const didAddress = '39fgdfkdsflgl404503400fgkdfgll45030450fgkkdflgl';

  return (
    <OnBoardLayout className={style['associated-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={eye} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            We have seen your social account before.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            Sorry, your sign in information has already been linked with another
            profile. You have two options, sign in to the associated profile or
            create a new one.
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Why has this happened? Help
          </OnBoardLayoutLeftContentIntro>
          <ArrowButton />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Sign into the associated profile
          </OnBoardLayoutRightContentTitle>
          <Text16>Decentalized Identity (DID):</Text16>
          {/* <TextInput
            value={fname}
            label='First Name'
            onChange={(n) => setFName(n)}
            placeholder='Enter your first name'
          /> */}
          <div className={style['new-did-address']}>{didAddress}</div>
          <Text16 style={{ marginTop: '17px' }}>
            Has been already linked to this social media account, sign into this
            profile below.
          </Text16>
          <ButtonWithLogo
            dark
            mt={32}
            text='Sign in to profile'
            onClick={() => {}}
          />

          <OnBoardLayoutRightContentTitle style={{ marginTop: '96px' }}>
            Create new profile
          </OnBoardLayoutRightContentTitle>
          <Text16>
            Use your already associated social account to create a new profile.
          </Text16>

          <ButtonWithLogo
            text='Create new profile'
            onClick={() => {}}
            mt={42}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
