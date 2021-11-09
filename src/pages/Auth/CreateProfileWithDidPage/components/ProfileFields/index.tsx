import React, { useState } from 'react';
import styled from 'styled-components';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import { ButtonWithLogo } from 'src/elements/buttons';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/texts';
import Avatar from 'src/components/Avatar';
import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import wavinghand from 'src/assets/icon/wavinghand.png';

import style from './style.module.scss';

import { validateEmail } from 'src/utils/validation';
import { UserType } from 'src/utils/user';

import EmailVerificationDetailContent, {
  EmailVerificationDetailModal
} from 'src/components/Auth/Email';
import { requestCreateEmailUser } from 'src/components/Auth/fetchapi';

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
}

const UseDetailsForm: React.FC<Props> = ({ setUserInfo, userInfo }) => {
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

  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
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
            Complete your profile
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            Having multiple profiles is messy. Your personal information is
            copied and stored on every app. Profile gives you total control of
            your digital world, in one place. Finally unlock the power of your
            content online.
          </OnBoardLayoutLeftContentDescription>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <AvatarArea>
            <Avatar did={userInfo ? userInfo.did : ''} />
          </AvatarArea>

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
              displayText ===
              'Verification email is sent to you. Please confirm to complete your registration.'
                ? 'Verify'
                : 'Create new profile'
            }
            onClick={async () => {
              if (
                displayText ===
                'Verification email is sent to you. Please confirm to complete your registration.'
              ) {
                setShowEmailVerifyModal(true);
              } else {
                await onSubmit();
              }
            }}
          />

          <EmailVerificationDetailModal
            isOpen={showEmailVerifyModal}
            backdropDismiss={false}
          >
            <EmailVerificationDetailContent
              close={() => setShowEmailVerifyModal(false)}
              email={email}
              resend={onSubmit}
            />
          </EmailVerificationDetailModal>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default UseDetailsForm;
