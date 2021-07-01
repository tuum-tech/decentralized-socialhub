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

interface Props {
  setUserInfo: (name: string, email: string) => void;
  isCreate?: boolean;
}

const UseDetailsForm: React.FC<Props> = ({ setUserInfo, isCreate = true }) => {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const setField = (fieldName: string, fieldValue: string) => {
    setError('');
    if (fieldName === 'name') setname(fieldValue);
    if (fieldName === 'email') setEmail(fieldValue);
  };

  return (
    <OnBoardLayout className={style['create-profile']}>
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
            onChange={n => setField('name', n)}
            placeholder="Enter your full name"
            hasError={error !== '' && name === ''}
          />
          <TextInput
            value={email}
            label={
              error === 'Not correct Email' ? 'Type valid Email' : 'E-mail'
            }
            onChange={n => setField('email', n)}
            placeholder="Enter your email"
            hasError={
              (error !== '' && email === '') || error === 'Not correct Email'
            }
            type="email"
          />
          <ButtonWithLogo
            text={
              isCreate ? 'Create your profile now' : 'Complete your profile now'
            }
            onClick={() => {
              if (name === '' || email === '') {
                setError('You should fill all the blanks');
                return;
              }
              if (!validateEmail(email)) {
                setError('Not correct Email');
                return;
              }
              setUserInfo(name, email);
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default UseDetailsForm;
