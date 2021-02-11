/**
 * Page
 */

import React from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout';
import { ButtonLink, ArrowButton } from 'src/components/buttons';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import wavinghand from '../../../assets/icon/wavinghand.png';

import style from './style.module.scss';

const SignHelp = () => {
  return (
    <OnBoardLayout className={style['did-signin']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            What is elastOS?
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className='mt-25px'>
            Don’t forget to fill out as much of your profile as you can. You
            will earn badges and be set up for the future - where you can earn
            off your data, under your control!
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className='my-25px'>
            Download for iOS here or Android here
          </OnBoardLayoutLeftContentIntro>
          <ButtonLink width={26} to='/sign/qr'>
            <ArrowButton />
          </ButtonLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight></OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default SignHelp;
