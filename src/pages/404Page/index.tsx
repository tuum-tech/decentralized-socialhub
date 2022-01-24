import React from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutRight,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import { SignInButton } from 'src/elements/buttons';
import { Title40, Text12, Text18 } from 'src/elements/texts';
import weird from 'src/assets/icon/weird.png';

import style from './style.module.scss';

const DefaultPage = () => {
  return (
    <OnBoardLayout className={style['create-profile']}>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={weird} />
          <Title40 className="mt-18px">404 Not found</Title40>
          <Text18 className="mt-25px">
            We can't find the right page for you
          </Text18>
          <Text12 className="mt-86px mb-0">Already have a profile?</Text12>
          <SignInButton width="120px" to="/sign-did">
            Sign in Here
          </SignInButton>
          <Text12 className="mt-25px mb-0">Or create new profile here</Text12>

          <SignInButton width="160px" to="/create-profile">
            Create new Profile
          </SignInButton>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight />
    </OnBoardLayout>
  );
};

export default DefaultPage;
