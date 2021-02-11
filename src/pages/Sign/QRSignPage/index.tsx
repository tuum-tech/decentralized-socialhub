/**
 * Page
 */

import React, { useState } from 'react';
import { IonImg } from '@ionic/react';

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
import ArrowButton from 'src/elements/buttons/ArrowButton';
import { Text16 } from 'src/elements/texts';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import phone from '../../../assets/icon/phone.png';

import style from './style.module.scss';

const CreateProfile = () => {
  const [error, setError] = useState(false);

  const renderBasicContents = () => {
    return (
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={phone} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            elastOS Sign in
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentIntro className='mt-86px mb-20px'>
            What is elastOS? Help
          </OnBoardLayoutLeftContentIntro>
          <ArrowButton />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
    );
  };

  const renderErrorContents = () => {
    return (
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={phone} />
          <OnBoardLayoutLeftContentTitle className='mt-18px'>
            elastOS Sign in
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentIntro className='mt-86px mb-20px'>
            What is elastOS? Help
          </OnBoardLayoutLeftContentIntro>
          <ArrowButton />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
    );
  };

  return (
    <OnBoardLayout className={style['qr-sign']}>
      {error ? renderErrorContents() : renderBasicContents()}
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            QR Code
          </OnBoardLayoutRightContentTitle>
          <Text16>Scan the QR code with your elastOS application</Text16>
          <div className={style['qr-frame']}>
            <IonImg src='../../assets/qr-code.svg' />
            <Text16>
              QR code expires in <span>00:30</span>
            </Text16>
          </div>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfile;
