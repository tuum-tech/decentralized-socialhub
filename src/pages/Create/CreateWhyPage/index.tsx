/**
 * Page
 */

import React from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  WavingHandImg,
} from 'src/components/layouts/OnBoardLayout';
import ArrowButton from 'src/elements/buttons/ArrowButton';

import whitelogo from '../../../assets/logo/whitetextlogo.png';
import weird from '../../../assets/icon/weird.png';

import style from './style.module.scss';

const CreateWhyPage: React.FC = () => {
  return (
    <OnBoardLayout className={style['associated-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={weird} />
          <OnBoardLayoutLeftContentTitle
            style={{ marginTop: '18px', marginBottom: '25px' }}
          >
            Why has this happened?
          </OnBoardLayoutLeftContentTitle>
          <ArrowButton />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight></OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateWhyPage;
