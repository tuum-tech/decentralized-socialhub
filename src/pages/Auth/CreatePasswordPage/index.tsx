import { StaticContext, RouteComponentProps, Redirect } from 'react-router';
import styled from 'styled-components';
import React, { useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
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
import Check from '../components/Check';

import keyimg from 'src/assets/icon/key.png';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { SubState } from 'src/store/users/types';
import { InferMappedProps, LocationState } from './types';
import { DidService } from 'src/services/did.service.new';
import FooterLinks, {
  Footer
} from 'src/components/layouts/OnBoardLayout/FooterLinks';

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
  const [status, setStatus] = useState(0);
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

  const onButtonClick = async () => {
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
        timestamp: Date.now(),
        ...props.location.state
      };
      setStatus(1);
      let userService = new UserService(await DidService.getInstance());
      const res = await userService.LockWithDIDAndPwd(user, password);
      if (res && res.did !== '') {
        eProps.setSession({
          session: await userService.updateSession(res)
        });
        window.localStorage.setItem('isLoggedIn', 'true');
        setStatus(2);
      } else {
        setStatus(0);
      }
    }
  };

  if (status === 2) {
    return <Redirect to="/profile" />;
  }

  return (
    <OnBoardLayout>
      {status === 1 && <LoadingIndicator loadingText="Encrypting now..." />}
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
          <Footer>
            <FooterLinks></FooterLinks>
          </Footer>
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
            onHitEnter={async () => {
              await onButtonClick();
            }}
            placeholder="Enter your password"
          />
          {error !== '' && <ErrorText>{error}</ErrorText>}
          <ThemeButton
            text="Continue"
            onClick={async () => {
              await onButtonClick();
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
