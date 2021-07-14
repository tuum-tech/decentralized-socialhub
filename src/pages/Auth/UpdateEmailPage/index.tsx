/**
 * Page
 */

import React, { useState, useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { SubState } from 'src/store/users/types';
import { setSession } from 'src/store/users/actions';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle
} from 'src/components/layouts/OnBoardLayout';
import { ArrowButton, ButtonLink, SignInButton } from 'src/elements/buttons';
import { Text16 } from 'src/elements/texts';

import { UserService } from 'src/services/user.service';

import { requestVerifyCode } from './fetchapi';
import style from './style.module.scss';
import { DidService } from 'src/services/did.service.new';

interface IVerifyCodeResponse {
  data: {
    return_code: string;
    name: string;
    email: string;
  };
}

const UpdateEmailPage: React.FC<any> = ({ eProps, ...props }: any) => {
  const { session } = props;
  let code = props.match.params.code;
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      if (session.did) {
        let response = (await requestVerifyCode(code)) as IVerifyCodeResponse;
        if (response.data.return_code === 'CODE_CONFIRMED') {
          session.loginCred.email = window.localStorage.getItem(
            `updated_email_${session.did.replace('did:elastos:', '')}`
          );
          console.log(session.loginCred);
          let userService = new UserService(new DidService());
          eProps.setSession({
            session: await userService.updateSession(session)
          });
        }
        setStatus(response.data.return_code);
      } else {
        setStatus('CODE_UNDEFINED');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getRedirect = () => {
    if (status === '') {
      return (
        <OnBoardLayout className={style['create-profile']}>
          <OnBoardLayoutLeft>
            <OnBoardLayoutLeftContent>
              <OnBoardLayoutLeftContentTitle className="mt-18px">
                Checking things...
              </OnBoardLayoutLeftContentTitle>
              <OnBoardLayoutLeftContentDescription className="mt-25px">
                Will take a moment
              </OnBoardLayoutLeftContentDescription>

              <ButtonLink width={26} to="/sign-did">
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
      return <Redirect to="/profile" />;
    } else
      return (
        <OnBoardLayout className={style['create-profile']}>
          <OnBoardLayoutLeft>
            <OnBoardLayoutLeftContent>
              <OnBoardLayoutLeftContentTitle className="mt-18px">
                A better way to be online.
              </OnBoardLayoutLeftContentTitle>
              <OnBoardLayoutLeftContentDescription className="mt-25px">
                Having multiple profiles is messy. Your personal information is
                copied and stored on every app. Profile gives you total control
                of your digital world, in one place. Finally unlock the power of
                your content online.
              </OnBoardLayoutLeftContentDescription>
              <OnBoardLayoutLeftContentIntro className="mt-25px mb-0">
                Already have a profile?
              </OnBoardLayoutLeftContentIntro>
              <SignInButton width={120} to="/sign-did">
                Sign in Here
              </SignInButton>
            </OnBoardLayoutLeftContent>
          </OnBoardLayoutLeft>
          <OnBoardLayoutRight>
            <OnBoardLayoutRightContent>
              <OnBoardLayoutRightContentTitle>
                Something is wrong! {code}
              </OnBoardLayoutRightContentTitle>
              <Text16 style={{ marginBottom: '54px' }}>
                The verification code is not right or is expired. Let's try
                again <Link to="/create-profile">here</Link>
              </Text16>
            </OnBoardLayoutRightContent>
          </OnBoardLayoutRight>
        </OnBoardLayout>
      );
  };

  return getRedirect();
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(UpdateEmailPage);
