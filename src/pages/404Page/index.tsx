import React from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutRight,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { SignInButton } from 'src/elements/buttons';

import weird from 'src/assets/icon/weird.png';

import style from './style.module.scss';

const DefaultPage = () => {
  return (
    <OnBoardLayout className={style['create-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={weird} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            404 Not found
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            We can't find the right page for you
          </OnBoardLayoutLeftContentDescription>
          <OnBoardLayoutLeftContentIntro className="mt-86px mb-0">
            Already have a profile?
          </OnBoardLayoutLeftContentIntro>
          <SignInButton width={120} to="/sign-did">
            Sign in Here
          </SignInButton>
          <OnBoardLayoutLeftContentIntro className="mt-25px mb-0">
            Or create new profile here
          </OnBoardLayoutLeftContentIntro>

          <SignInButton width={120} to="/create-profile">
            Create new Profile
          </SignInButton>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight />
    </OnBoardLayout>
  );
};

export default DefaultPage;
