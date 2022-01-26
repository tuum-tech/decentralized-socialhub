/**
 * Page
 */

import React, { useState } from 'react';
import styled from 'styled-components';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import ThemeButton from 'src/elements/buttons/ThemeButton';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16, Title40, Text18 } from 'src/elements/texts';
import LoadingIndicator from 'src/elements/LoadingIndicator';

import keyimg from 'src/assets/icon/key.png';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import Check from '../Check';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

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

  const onDefaultButtonClick = () => {
    if (disabled) return;
    if (password === '' || repeatPassword === '') {
      setError('You should fill the input fields');
    } else if (password !== repeatPassword) {
      setError('Password is different');
    } else {
      next(password);
    }
  };

  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Encrypting Now..." />}
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={keyimg} />
          <Title40 className="mt-18px">
            Your password is not stored by us
          </Title40>
          <Text18 className="mt-25px">
            This is a locally stored password that protects your main profile
            account (decentralized identity).
          </Text18>
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
            onHitEnter={() => {
              onDefaultButtonClick();
            }}
            placeholder="Enter your password"
          />

          <ThemeButton
            text={displayText !== '' ? displayText : 'Continue'}
            onClick={() => {
              onDefaultButtonClick();
            }}
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}

          <Footer>
            <FooterLinks />
          </Footer>
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default SetPassword;
