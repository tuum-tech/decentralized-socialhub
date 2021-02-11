/**
 * Page
 */

import React from 'react';
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
import { Text16 } from 'src/components/texts';
import { ButtonLink, ArrowButton } from 'src/components/buttons';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import phone from '../../../assets/icon/phone.png';

import style from './style.module.scss';

const CreateProfile = () => {
  return (
    <OnBoardLayout className={style['qr-sign']}>
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
          <ButtonLink width={26} to='/sign/help'>
            <ArrowButton />
          </ButtonLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
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
