import { StaticContext, RouteComponentProps } from 'react-router';
import styled from 'styled-components';
import React, { useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
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
import ButtonWithLogo from 'src/elements/buttons/ButtonWithLogo';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/texts';
import Check from '../components/Check';

import whitelogo from 'src/assets/logo/whitetextlogo.png';
import keyimg from 'src/assets/icon/key.png';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { SubState } from 'src/store/users/types';
import { InferMappedProps, LocationState } from './types';
import { DidService } from 'src/services/did.service';

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

type PageProps = InferMappedProps &
  RouteComponentProps<{}, StaticContext, LocationState>;

const CreatePasswordPage: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

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
                const user = {
                  mnemonics: '',
                  passhash: '',
                  onBoardingCompleted: false,
                  tutorialStep: 1,
                  ...props.location.state
                };
                setLoading(true);
                let userService = new UserService(new DidService());
                const res = await userService.LockWithDIDAndPwd(user, password);

                setLoading(false);
                if (res && res.did !== '') {
                  eProps.setSession({ session: res });
                  window.localStorage.setItem('isLoggedIn', 'true');
                  window.location.href = '/profile';
                }
              }
            }}
          />
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

export default connect(mapStateToProps, mapDispatchToProps)(CreatePasswordPage);
