import React, { useState } from 'react';
import { StaticContext, RouteComponentProps } from 'react-router';

import {
  OnBoardLayout,
  OnBoardLayoutLeft,
  OnBoardLayoutLeftContent,
  OnBoardLayoutLeftContentTitle,
  OnBoardLayoutLeftContentIntro,
  OnBoardLayoutLogo,
  OnBoardLayoutRight,
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle,
  WavingHandImg
} from 'src/components/layouts/OnBoardLayout';
import {
  ButtonLink,
  ArrowButton,
  ButtonWithLogo
} from 'src/components/buttons';
import { ErrorTxt } from 'src/components/texts';
import TextInput from 'src/components/inputs/TextInput';
import { UserService } from 'src/services/user.service';
import wavinghand from 'src/assets/icon/wavinghand.png';
import whitelogo from 'src/assets/logo/whitetextlogo.png';

import { LocationState } from './types';
import { DidService } from 'src/services/did.service';

const UnlockUserPage: React.FC<RouteComponentProps<
  {},
  StaticContext,
  LocationState
>> = props => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [dids] = useState(
    props.location.state && props.location.state.dids
      ? props.location.state.dids
      : []
  );

  const unlockUser = async () => {
    if (!dids || dids.length === 0) return;
    let res = null;
    // if (dids.length === 1) {
    //   res = await UserService.UnLockWithDIDAndPwd(dids[0], password);
    // } else {
    let userService = new UserService(new DidService());
    for (let i = 0; i < dids.length; i++) {
      const did = dids[i];
      res = await userService.UnLockWithDIDAndPwd(did, password);
    }
    // }
    if (res) {
      window.location.href = '/profile';
      return;
    }
    // else {
    //   setError('User Not found secured by this password');
    // }
  };

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo src={whitelogo} />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <OnBoardLayoutLeftContentTitle className="mt-18px">
            Continue with your password
          </OnBoardLayoutLeftContentTitle>
          <OnBoardLayoutLeftContentIntro className="my-25px">
            Forgot your password? Help
          </OnBoardLayoutLeftContentIntro>
          <ButtonLink width={26} to="/forgot-password">
            <ArrowButton />
          </ButtonLink>
        </OnBoardLayoutLeftContent>
      </OnBoardLayoutLeft>
      <OnBoardLayoutRight>
        <OnBoardLayoutRightContent style={{ marginTop: 0 }}>
          <OnBoardLayoutRightContentTitle>
            Enter your password
          </OnBoardLayoutRightContentTitle>
          <TextInput
            value={password}
            label="Password"
            onChange={n => setPassword(n)}
            placeholder="Enter your password"
          />
          {error !== '' && <ErrorTxt>{error}</ErrorTxt>}
          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text="Continue"
            onClick={async () => {
              if (password === '') {
                setError('You should fill the password');
                return;
              } else {
                setError('');
                await unlockUser();
              }
            }}
          />
        </OnBoardLayoutRightContent>
      </OnBoardLayoutRight>
    </OnBoardLayout>
  );
};

export default UnlockUserPage;
