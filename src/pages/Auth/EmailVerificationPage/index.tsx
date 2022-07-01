import { StaticContext, RouteComponentProps, Redirect } from 'react-router';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle
} from 'src/components/layouts/OnBoardLayout';
import TextInput from 'src/elements/inputs/TextInput';
import { Title40, Text12, Text18, Text16 } from 'src/elements/texts';
import { ThemeButton } from 'src/elements/buttons';

import { requestUpdateEmail } from 'src/components/Auth/fetchapi';
import { AccountType } from 'src/services/user.service';
import { requestVerifyCode } from 'src/components/Auth/fetchapi';

import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';
import useSession from 'src/hooks/useSession';

import { LocationState } from './types';

import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

const Content = styled(OnBoardLayoutRightContent)`
  .below {
    color: #7a7a9d;
    margin-top: 28px;
    margin-bottom: 40px;

    button {
      color: #ff5a5a;
    }
  }

  .resend {
    background: transparent;
  }
`;

type PageProps = RouteComponentProps<{}, StaticContext, LocationState>;

const EmailVerificationPage: React.FC<PageProps> = (props: PageProps) => {
  const { setSession } = useSession();
  const history = useHistory();

  const [code, setCode] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  const [btnText, setBtnText] = useState('Verify & Continue');

  const [user, setUser] = useState({
    name: '',
    email: ''
  });

  useEffect(() => {
    const { name, email } = props.location.state;

    if (name !== '' && email !== '') {
      setUser({ name, email });
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loaded && (user.name === '' || user.email === '')) {
    return <Redirect to="/create-profile" />;
  }

  const onVerify = async () => {
    if (code === '') {
      setError('Type your code');
      return;
    }
    if (code.length !== 6) {
      setError('Invalid code length');
      return;
    }

    setBtnText('Verifing your code now.');
    let response = (await requestVerifyCode(
      code,
      user.email
    )) as IVerifyCodeResponse;

    let status = response.data.return_code;
    if (status === 'CONFIRMED') {
      const { name, email, did } = response.data;
      let session = {
        did,
        name,
        loginCred: {
          email
        },
        credential: code,
        service: AccountType.Email
      };

      let userService = new UserService(await DidService.getInstance());

      if (session.did && !session.did.startsWith('did:elastos:')) {
        session.did = '';
      }

      let sessionItem = await userService.CreateNewUser(
        session.name,
        session.service,
        session.loginCred,
        session.credential,
        session.did,
        '',
        '',
        ''
      );

      setSession(sessionItem);
      history.push('/profile');
    } else {
      setError('Invalid Code !');
    }

    setBtnText('Verify & Continue');
  };

  const resendVerificationCode = async () => {
    setBtnText('Resending verification code');

    let response = (await requestUpdateEmail(
      'temporary_' + user.name + user.email,
      user.email
    )) as IUpdateEmailResponse;

    if (response && response.data && response.data.status === 'success') {
    } else {
      setError('Failed to send verification');
    }
    setBtnText('Verify & Continue');
  };

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <Title40 className="mt-18px">A better way to be online.</Title40>
          <Text18 className="mt-25px">
            Having multiple profiles is messy. Your personal information is
            copied and stored on every app. Profile gives you total control of
            your digital world, in one place. Finally, unlock the power of your
            content online.
          </Text18>
          <Text12 className="mt-86px mb-0">Already have a profile?</Text12>
          <ThemeButton
            onClick={() => history.push('/sign-in')}
            img="white"
            text="Sign In with Essentials"
            style={{ marginTop: '25px', width: '250px', background: '#313049' }}
          />
          <Footer>
            <FooterLinks />
          </Footer>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <Content>
          <OnBoardLayoutRightContentTitle style={{ marginBottom: '46px' }}>
            Check your Inbox
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '54px' }}>
            Verification code is sent to your <strong>{user.email}</strong>.
            Please confirm to complete your registration.
          </Text16>

          <TextInput
            value={code}
            label="Enter 6 Digit Verification Code "
            onChange={n => {
              setError('');
              setCode(n);
            }}
            placeholder="Ex: 8CA87D"
            hasError={error.toLowerCase().includes('code')}
          />

          <p className="below">
            Didn't receive the code?
            <button className="resend" onClick={resendVerificationCode}>
              Send Again
            </button>
          </p>

          {error !== '' && <ErrorText>{error}</ErrorText>}

          <ThemeButton
            style={{ marginTop: '20px' }}
            text={btnText}
            onClick={onVerify}
          />
        </Content>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default EmailVerificationPage;
