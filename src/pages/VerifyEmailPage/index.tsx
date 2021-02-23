/**
 * Page
 */

import React, { useState, useEffect } from 'react';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
} from 'src/components/layouts/OnBoardLayout';

import { ArrowButton, ButtonLink } from 'src/components/buttons';

import { Text16 } from 'src/components/texts';

import style from './style.module.scss';
import { Redirect, RouteComponentProps } from 'react-router';
import { requestVerifyCode } from './fetchapi';

interface MatchParams {
  code: string;
}

interface IVerifyCodeResponse {
  data: {
    return_code: string;
  };
}

interface Props extends RouteComponentProps<MatchParams> {}

const VerifyEmailPage: React.FC<RouteComponentProps<MatchParams>> = (
  props: RouteComponentProps<MatchParams>
) => {
  let code: string = props.match.params.code;
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      let response = (await requestVerifyCode(code)) as IVerifyCodeResponse;
      setStatus(response.data.return_code);
    })();
  }, []);

  const getRedirect = () => {
    if (status === '') {
      return (
        <OnBoardLayout className={style['create-profile']}>
          <OnBoardLayoutLeft>
            <OnBoardLayoutLeftContent>
              <OnBoardLayoutLeftContentTitle className='mt-18px'>
                Checking things...
              </OnBoardLayoutLeftContentTitle>
              <OnBoardLayoutLeftContentDescription className='mt-25px'>
                Will take a moment
              </OnBoardLayoutLeftContentDescription>

              <ButtonLink width={26} to='/sign/did'>
                <ArrowButton />
              </ButtonLink>
            </OnBoardLayoutLeftContent>
          </OnBoardLayoutLeft>
          <OnBoardLayoutRight>
            <OnBoardLayoutRightContent>Loading</OnBoardLayoutRightContent>
          </OnBoardLayoutRight>
        </OnBoardLayout>
      );
    }
    if (status === 'CODE_CONFIRMED') {
      return (
        <Redirect
          to={{
            pathname: '/profile',
          }}
        />
      );
    } else
      return (
        <OnBoardLayout className={style['create-profile']}>
          <OnBoardLayoutLeft>
            <OnBoardLayoutLeftContent>
              <OnBoardLayoutLeftContentTitle className='mt-18px'>
                A better way to be online.
              </OnBoardLayoutLeftContentTitle>
              <OnBoardLayoutLeftContentDescription className='mt-25px'>
                Having multiple profiles is messy. Your personal information is
                copied and stored on every app. Profile gives you total control
                of your digital world, in one place. Finally unlock the power of
                your content online.
              </OnBoardLayoutLeftContentDescription>
              <OnBoardLayoutLeftContentIntro className='my-25px'>
                Already have a profile? Sign in
              </OnBoardLayoutLeftContentIntro>
              <ButtonLink width={26} to='/sign/did'>
                <ArrowButton />
              </ButtonLink>
            </OnBoardLayoutLeftContent>
          </OnBoardLayoutLeft>
          <OnBoardLayoutRight>
            <OnBoardLayoutRightContent>
              <OnBoardLayoutRightContentTitle>
                Something is wrong! {code}
              </OnBoardLayoutRightContentTitle>
              <Text16 style={{ marginBottom: '54px' }}>
                The verification code is not right or is expired. Let's try
                again <ButtonLink to='/create/profile'>here</ButtonLink>
              </Text16>
            </OnBoardLayoutRightContent>
          </OnBoardLayoutRight>
        </OnBoardLayout>
      );
  };

  return getRedirect();
};

export default VerifyEmailPage;
