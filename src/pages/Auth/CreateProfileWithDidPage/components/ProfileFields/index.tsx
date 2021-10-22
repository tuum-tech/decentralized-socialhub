import React, { useState } from 'react';

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
import { ButtonWithLogo, SignInButton } from 'src/elements/buttons';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/texts';
import { validateEmail } from 'src/utils/validation';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import wavinghand from 'src/assets/icon/wavinghand.png';
import style from './style.module.scss';
import { UserType } from 'src/utils/user';
import request, { BaseplateResp } from 'src/baseplate/request';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import Avatar from 'src/components/Avatar';
import styled from 'styled-components';

export function requestCreateEmailUser(
  name: string,
  email: string,
  did: string
): Promise<BaseplateResp> {
  return request(
    `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/credential/create`,
    {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
        Accept: 'application/json'
      },
      body: JSON.stringify({
        name,
        email,
        phone: '',
        did,
        smsCode: false
      })
    }
  );
}

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

const AvatarArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  marign: 0 0 20px;
`;

interface Props {
  userInfo?: UserType;
  setUserInfo: (name: string, email: string) => void;
  isCreate?: boolean;
}

const UseDetailsForm: React.FC<Props> = ({
  setUserInfo,
  isCreate = true,
  userInfo
}) => {
  const getUserName = () => {
    if (userInfo !== undefined) {
      return userInfo.name;
    }
    return '';
  };

  const isUserNameReadOnly = () => {
    return getUserName() !== '';
  };

  const isEmailReadOnly = () => {
    return getEmail() !== '';
  };

  const getEmail = () => {
    if (
      userInfo !== undefined &&
      userInfo.loginCred !== undefined &&
      userInfo.loginCred.email !== undefined
    )
      return userInfo.loginCred.email;
    return '';
  };

  const [name, setname] = useState(getUserName());
  const [email, setEmail] = useState(getEmail());
  const [error, setError] = useState('');
  const [loading, setLoading] = useState('');
  const [displayText, setDisplayText] = useState('');

  const setField = (fieldName: string, fieldValue: string) => {
    setError('');
    if (fieldName === 'name') setname(fieldValue);
    if (fieldName === 'email') setEmail(fieldValue);
  };

  const onSubmit = async () => {
    if (name === '') {
      setError('You should fill all the blanks');
      return;
    }
    if (email !== '') {
      if (!validateEmail(email)) {
        setError('Invalid Email address');
        return;
      }
      setLoading('Creating new profile now');
      let response = (await requestCreateEmailUser(
        name,
        email,
        userInfo?.did ?? ''
      )) as ICreateUserResponse;
      if (response.meta.code !== 200) {
        setError('An error happened when creating user.');
      }

      if (
        response &&
        response.data &&
        response.data.return_code === 'WAITING_CONFIRMATION'
      ) {
        setDisplayText(
          'Verification email is sent to you. Please confirm to complete your registration.'
        );
      } else {
        setUserInfo(name, email);
      }
      setLoading('');
    } else {
      setUserInfo(name, email);
    }
  };

  return (
    <OnBoardLayout className={style['create-profile']}>
      {loading !== '' && <LoadingIndicator loadingText={loading} />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            {isCreate ? 'A better way to be online.' : 'Complete your profile'}
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            {isCreate
              ? 'Having multiple profiles is messy. Your personal information is copied and stored on every app. Profile gives you total control of your digital world, in one place. Finally unlock the power of your content online.'
              : 'Complete your profile by filling your first name, last name, and email'}
          </OnBoardLayoutLeftContentDescription>
          {isCreate && (
            <OnBoardLayoutLeftContentIntro className="mt-25px mb-0">
              Already have a profile?
            </OnBoardLayoutLeftContentIntro>
          )}
          {isCreate && (
            <SignInButton width={120} to="/sign-did">
              Sign in
            </SignInButton>
          )}
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <AvatarArea>
            <Avatar did={userInfo ? userInfo.did : ''} />
          </AvatarArea>

          {isCreate && (
            <OnBoardLayoutRightContentTitle>
              Create your profile
            </OnBoardLayoutRightContentTitle>
          )}
          {isCreate && (
            <Text16 style={{ marginBottom: '54px' }}>
              It’s free and easy to get set up.
            </Text16>
          )}
          <TextInput
            value={name}
            label="Name"
            readonly={isUserNameReadOnly()}
            onChange={n => setField('name', n)}
            placeholder="Enter your full name"
            hasError={error !== '' && name === ''}
          />
          <TextInput
            value={email}
            label={
              error === 'Invalid Email address' ? 'Type valid Email' : 'E-mail'
            }
            onChange={n => setField('email', n)}
            onHitEnter={async () => {
              await onSubmit();
            }}
            placeholder="Enter your email"
            readonly={isEmailReadOnly()}
            hasError={
              (error !== '' && email === '') || error === 'Not correct Email'
            }
            type="email"
          />

          {error !== '' && <ErrorText>{error}</ErrorText>}
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}

          <ButtonWithLogo
            text={
              isCreate ? 'Create your profile now' : 'Complete your profile now'
            }
            onClick={async () => {
              await onSubmit();
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default UseDetailsForm;
