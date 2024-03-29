import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Redirect } from 'react-router';
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
import { ThemeButton, ThemeTransparentButton } from 'src/elements/buttons';
import { Text16, Title40, Text18, Text12 } from 'src/elements/texts';
import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import useSession from 'src/hooks/useSession';

import FieldDivider from '../components/FieldDivider';
import style from './style.module.scss';
import createLeftBg from 'src/assets/new/auth/create_left_bg.png';

import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

import EmailUserCreate from './components/EmailUserCreate';
import SocialLoginForm from './components/SocialLoginForm';

const MobileContent = styled.div`
  display: none;
  padding-top: 50px;

  @media only screen and (max-width: 980px) {
    display: flex;
    text-align: center;
    flex-direction: column;

    a {
      margin-left: auto;
      margin-right: auto;
      display: block;
      max-width: 300px !important;
    }
  }
`;

const CreateProfilePage: React.FC = () => {
  const { setSession } = useSession();
  const history = useHistory();
  const [loading, setLoading] = useState('');

  const [signedUsers, setSignedUsers] = useState<string[]>([]);
  const [mode, setMode] = useState(0); // 0: create new, 1: sign in using pre logged

  useEffect(() => {
    if (
      history.location.search &&
      history.location.search.includes('?ref=did:elastos:')
    ) {
      window.localStorage.setItem(
        'referral',
        history.location.search.replace('?ref=', '')
      );
    }
  }, [history.location.search]);

  useEffect(() => {
    (async () => {
      const signedUserDids = await UserService.getSignedUsers();
      setSignedUsers(signedUserDids);
      setMode(signedUserDids.length > 0 ? 1 : 0);
    })();
  }, []);

  const removeUser = async (removeDid: string) => {
    setLoading('Wait while remove this user');
    await UserService.removeLocalUser(removeDid);
    const newSignedUsers = signedUsers.filter(item => item !== removeDid);
    if (newSignedUsers.length === 0) {
      setMode(0);
    } else {
      setSignedUsers(newSignedUsers);
    }
    setLoading('');
  };

  const isLoggedIn = window.localStorage.getItem('isLoggedIn');
  if (isLoggedIn) {
    return <Redirect to="/profile" />;
  }

  return (
    <OnBoardLayout className={style['create-profile']}>
      {loading !== '' && <LoadingIndicator loadingText={loading} />}
      <OnBoardLayoutLeft
        style={{
          backgroundImage: `url(${createLeftBg})`
        }}
      >
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <Title40 className="mt-18px" style={{ maxWidth: '410px' }}>
            Own Yourself in the Web3 Universe
          </Title40>
          <Text18 className="mt-25px" style={{ maxWidth: '420px' }}>
            Communicate your personal story and build communities how you want
            with crypto, NFT, and blockchain enthusiasts you can trust.
          </Text18>
          <Text12 className="mt-25px ">Already have a profile?</Text12>
          <ThemeButton
            onClick={() => history.push('/sign-in')}
            img="white"
            text="Sign In"
            style={{ marginTop: '25px', width: '250px', background: '#313049' }}
          />
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle>
            Create your profile
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '54px' }}>
            It's free and easy to get set up.
          </Text16>

          <EmailUserCreate
            onSuccess={(name: string, email: string) => {
              history.push({
                pathname: '/email-verification',
                state: { name, email }
              });
            }}
          />

          <FieldDivider text="or connect with" />

          <SocialLoginForm />

          <MobileContent>
            <Text12>Already have a profile?</Text12>
            <ThemeTransparentButton
              to="/sign-in"
              text="Sign in"
              hasImg={true}
            />
          </MobileContent>

          <Footer>
            <FooterLinks />
          </Footer>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreateProfilePage;
