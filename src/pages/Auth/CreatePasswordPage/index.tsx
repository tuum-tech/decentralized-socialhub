import { StaticContext, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import React, { useState, useEffect } from 'react';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/components/LoadingIndicator';
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

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import keyimg from 'src/assets/icon/key.png';

import { LocationState } from './types';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import Check from 'src/components/Check';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

const CreatePasswordPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');
  const [session, setSession] = useState<ISessionItem | null>(null);

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!session && props.location.state && props.location.state.did) {
      const {
        hiveHost,
        userToken,
        accountType,
        did,
        name,
        isDIDPublished,
        didPublishTime,
        loginCred
      } = props.location.state;

      let newSession = {
        hiveHost,
        userToken,
        accountType,
        did,
        name,
        isDIDPublished,
        didPublishTime,
        loginCred,
        mnemonics: '',
        passhash: '',
        onBoardingCompleted: false,
        tutorialStep: 1
      };
      setSession(newSession);
    }
  });

  const afterPasswordSet = async () => {
    if (!session) return;
    setLoading(true);
    await UserService.LockWithDIDAndPwd(session, password);
    window.location.href = '/profile';
    setLoading(false);
  };

  return (
    <OnBoardLayout>
      {loading && <LoadingIndicator loadingText="Encrypting now..." />}
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
            label="Re-enter Password"
            type="password"
            onChange={n => {
              setError('');
              setRepeatPassword(n);
            }}
            placeholder="Enter your password"
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}
          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text="Continue"
            onClick={async () => {
              if (password === '' || repeatPassword === '') {
                setError('You should fill the input fields');
              } else if (password !== repeatPassword) {
                setError('Password is different');
              } else {
                await afterPasswordSet();
              }
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default CreatePasswordPage;
