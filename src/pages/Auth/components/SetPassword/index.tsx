/**
 * Page
 */

import React, { useState } from 'react';
import styled from 'styled-components';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentDescription,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo';
import TextInput from 'src/components/inputs/TextInput';
import { Text16 } from 'src/components/texts';
import LoadingIndicator from 'src/components/LoadingIndicator';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import keyimg from 'src/assets/icon/key.png';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import Check from 'src/components/Check';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

interface Props {
  next: (password: string) => void;
  displayText?: string;
  loading?: boolean;
}

const SetPassword: React.FC<Props> = ({
  next,
  displayText = '',
  loading = false
}) => {
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const disabled = displayText !== '';

  const [lengthValid, setLengthValid] = useState(false);
  const [hasUppercase, setHasUppercase] = useState(false);
  const [hasLowercase, setHasLowercase] = useState(false);
  const [hasNumber, setHasNumber] = useState(false);
  const [hasSpecialChar, setHasSpecialChar] = useState(false);
  const [isInvalidPassword, setIsInvalidPassword] = useState(false);

  const validatePassword = (n: string): any => {
    setIsInvalidPassword(false);

    if (n.length > 8) setLengthValid(true);
    else {
      setLengthValid(false);
      setIsInvalidPassword(true);
    }

    if (/[A-Z]/.test(n)) setHasUppercase(true);
    else {
      setIsInvalidPassword(true);
      setHasUppercase(false);
    }

    if (/[a-z]/.test(n)) setHasLowercase(true);
    else {
      setHasLowercase(false);
      setIsInvalidPassword(true);
    }

    if (/[0-9]/.test(n)) setHasNumber(true);
    else {
      setHasNumber(false);
      setIsInvalidPassword(true);
    }

    if (/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(n))
      setHasSpecialChar(true);
    else {
      setHasSpecialChar(false);
      setIsInvalidPassword(true);
    }
  };

  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Encrypting Now..." />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={keyimg} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            Your password is not stored by us
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentDescription className="mt-25px">
            This is a locally stored password that protects your main profile
            account (decentralized identity).
          </OnBoardLayoutLeftContentDescription>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent>
          <OnBoardLayoutRightContentTitle style={{ marginBottom: '46px' }}>
            Create your password
          </OnBoardLayoutRightContentTitle>
          <TextInput
            value={password}
            label="Password"
            type="password"
            onChange={n => {
              setError('');
              validatePassword(n);

              setPassword(n);
            }}
            placeholder="Enter your password"
          />
          <IonGrid>
            <IonRow>
              <IonCol size="6">
                <Check text="8+ characters" isChecked={lengthValid} />
                <Check text="Uppercase" isChecked={hasUppercase} />
                <Check text="Lowercase" isChecked={hasLowercase} />
              </IonCol>
              <IonCol size="6">
                {/* <Check text="Alphanumeric" isChecked={hasLetter} /> */}
                <Check text="Number" isChecked={hasNumber} />
                <Check text="Special character" isChecked={hasSpecialChar} />
              </IonCol>
            </IonRow>
          </IonGrid>

          <TextInput
            readonly={isInvalidPassword}
            value={repeatPassword}
            type="password"
            label="Re-enter Password"
            onChange={n => {
              setError('');
              setRepeatPassword(n);
            }}
            placeholder="Enter your password"
          />

          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text={displayText !== '' ? displayText : 'Continue'}
            onClick={() => {
              if (disabled) return;
              if (password === '' || repeatPassword === '') {
                setError('You should fill the input fields');
              } else if (password !== repeatPassword) {
                setError('Password is different');
              } else {
                next(password);
              }
            }}
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default SetPassword;
