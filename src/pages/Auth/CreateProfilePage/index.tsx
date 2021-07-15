import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import {
  SocialButton,
  ButtonWithLogo,
  SignInButton
} from 'src/elements/buttons';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/texts';
import { UserService } from 'src/services/user.service';
import { validateEmail } from 'src/utils/validation';
import LoadingIndicator from 'src/elements/LoadingIndicator';

import { AlphaService } from 'src/services/alpha.service';
import TwitterApi from 'src/shared-base/api/twitter-api';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import wavinghand from 'src/assets/icon/wavinghand.png';

import MultiDidPasswordLogin from '../components/MultiDidPasswordLogin';
import FieldDivider from '../components/FieldDivider';
import style from './style.module.scss';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import {
  requestCreateUser,
  requestGoogleLogin,
  requestLinkedinLogin,
  requestFacebookLogin
} from './fetchapi';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

const DisplayText = styled(Text16)`
  text-align: center;
  color: green;
  margin-top: 8px;
`;

const CreateProfilePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [error, setError] = useState('');
  const [signedUsers, setSignedUsers] = useState<string[]>([]);
  const [mode, setMode] = useState(0); // 0: create new, 1: sign in using pre logged

  useEffect(() => {
    // UserService.clearPrevLocalData()
    AlphaService.isLocalCodeValid().then(isLocalCodeValid => {
      if (!isLocalCodeValid) {
        window.location.href = '/Alpha';
      }
    });
  }, []);

  useEffect(() => {
    (async () => {
      const signedUserDids = await UserService.getSignedUsers();
      setSignedUsers(signedUserDids);
      setMode(signedUserDids.length > 0 ? 1 : 0);
    })();
  }, []);

  const createUser = async () => {
    if (!name || !email) {
      setError('You should fill this field');
      return;
    }
    if (!validateEmail(email)) {
      setError('Not correct Email');
      return;
    }
    setLoading('Creating new profile now');
    let response = (await requestCreateUser(
      name,
      email
    )) as ICreateUserResponse;
    if (response.meta.code !== 200) {
      setDisplayText('An error happened when creating user.');
    }

    if (
      response &&
      response.data &&
      response.data.return_code === 'WAITING_CONFIRMATION'
    ) {
      setDisplayText(
        'Verification email is sent to you. Please confirm to complete your registration.'
      );
    }
    setLoading('');
  };

  const setField = (fieldName: string, fieldValue: string) => {
    setError('');
    setDisplayText('');
    if (fieldName === 'name') setName(fieldValue);
    if (fieldName === 'email') setEmail(fieldValue);
  };

  const sociallogin = async (socialType: string) => {
    if (socialType === 'twitter') {
      type MyType = { meta: string; data: { request_token: string } };
      // gets the linkedin auth endpoint
      const response = (await TwitterApi.GetRequestToken()) as MyType;

      // redirects
      window.location.replace(
        `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.request_token}`
      );
      return;
    }

    type MyType = { meta: string; data: string };
    let url: MyType = {} as MyType;

    if (socialType === 'google') {
      // gets the linkedin auth endpoint
      url = (await requestGoogleLogin()) as MyType;
    } else if (socialType === 'facebook') {
      // gets the linkedin auth endpoint
      url = (await requestFacebookLogin()) as MyType;
    } else if (socialType === 'linkedin') {
      // gets the linkedin auth endpoint
      url = (await requestLinkedinLogin()) as MyType;
    }

    if (url) {
      window.location.href = url.data; // redirects
    }
  };

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

  if (mode === 1) {
    return (
      <MultiDidPasswordLogin
        dids={signedUsers}
        removeUser={removeUser}
        changeMode={() => setMode(0)}
        afterSuccess={(session: ISessionItem) => {
          eProps.setSession({ session });
          window.location.href = '/profile';
        }}
      />
    );
  }

  return (
    <OnBoardLayout className={style['create-profile']}>
      {loading !== '' && <LoadingIndicator loadingText={loading} />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            A better way to be online.
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            Having multiple profiles is messy. Your personal information is
            copied and stored on every app. Profile gives you total control of
            your digital world, in one place. Finally unlock the power of your
            content online.
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
            Create your profile
          </OnBoardLayoutRightContentTitle>
          <Text16 style={{ marginBottom: '54px' }}>
            It’s free and easy to get set up.
          </Text16>
          <TextInput
            value={name}
            label="Name"
            onChange={n => setField('name', n)}
            placeholder="Enter your Full name"
            hasError={error !== '' && name === ''}
          />
          <TextInput
            value={email}
            label="E-mail"
            onChange={n => setField('email', n)}
            placeholder="Enter your e-mail"
            hasError={error !== '' && email === ''}
            type="email"
          />

          {error !== '' && <ErrorText>{error}</ErrorText>}
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}

          <ButtonWithLogo text="Create new profile" onClick={createUser} />

          <FieldDivider text="or connect with" />
          <div className={style['social-btn-group']}>
            <SocialButton
              type="linkedin"
              onClick={async () => await sociallogin('linkedin')}
            />
            <SocialButton
              type="google"
              onClick={async () => await sociallogin('google')}
            />
            <SocialButton
              type="twitter"
              onClick={async () => await sociallogin('twitter')}
            />
            <SocialButton
              type="facebook"
              onClick={async () => await sociallogin('facebook')}
            />
          </div>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateProfilePage);
