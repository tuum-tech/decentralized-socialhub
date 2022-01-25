import React from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle
} from 'src/components/layouts/OnBoardLayout';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';
import { Text16 } from 'src/elements/texts';
import { ThemeButton, CreateProfileButton } from 'src/elements/buttons';

import leftBg from 'src/assets/new/auth/signin_left_bg.png';
import style from './style.module.scss';
import { LocationState } from './types';

const SignDidPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  const history = useHistory();
  return (
    <OnBoardLayout className={style['did-signin']}>
      <OnBoardLayoutLeft
        style={{
          backgroundImage: `url(${leftBg})`
        }}
      >
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <Footer>
            <FooterLinks></FooterLinks>
          </Footer>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>

      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Welcome back
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '35px', maxWidth: '420px' }}>
            Don't forget to fill out as much of your profile as you can. You
            will earn badges and be set up for the future — where you can earn
            off your data, under your control!
          </Text16>
          <ThemeButton
            img="white"
            onClick={() => history.push('/sign-did')}
            style={{ width: '100%' }}
          />

          <OnBoardLayoutRightContentTitle style={{ marginTop: '100px' }}>
            New to Profile?
          </OnBoardLayoutRightContentTitle>

          <CreateProfileButton to="/create-profile" />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default SignDidPage;
