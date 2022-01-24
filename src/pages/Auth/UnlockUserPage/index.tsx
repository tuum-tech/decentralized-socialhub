import React, { useState } from 'react';
import { StaticContext, RouteComponentProps, Redirect } from 'react-router';

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
import { ButtonLink, ArrowButton, ButtonWithLogo } from 'src/elements/buttons';
import { ErrorTxt, Title40, Text12 } from 'src/elements/texts';
import TextInput from 'src/elements/inputs/TextInput';
import { UserService } from 'src/services/user.service';
import wavinghand from 'src/assets/icon/wavinghand.png';
import whitelogo from 'src/assets/logo/whitetextlogo.png';
import { InferMappedProps, LocationState } from './types';
import { DidService } from 'src/services/did.service.new';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { connect } from 'react-redux';
import { SubState } from 'src/store/users/types';

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<{}, StaticContext, LocationState> {}

const UnlockUserPage: React.FC<PageProps> = ({
  eProps,
  ...props
}: PageProps) => {
  const [status, setStatus] = useState(0);
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
    let userService = new UserService(await DidService.getInstance());
    for (let i = 0; i < dids.length; i++) {
      const did = dids[i];
      res = await userService.UnLockWithDIDAndPwd(did, password);
    }
    // }
    if (res) {
      eProps.setSession({ session: res });
      setStatus(1);
    }
    // else {
    //   setError('User Not found secured by this password');
    // }
  };

  if (status === 1) {
    return <Redirect to="/profile" />;
  }

  const onDefaultButtonClick = async () => {
    if (password === '') {
      setError('You should fill the password');
      return;
    } else {
      setError('');
      await unlockUser();
    }
  };

  return (
    <OnBoardLayout>
      <OnBoardLayoutLeft>
        <OnBoardLayoutLogo />
        <OnBoardLayoutLeftContent>
          <WavingHandImg src={wavinghand} />
          <Title40 className="mt-18px">Continue with your password</Title40>
          <Text12 className="my-25px">Forgot your password? Help</Text12>
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
            onHitEnter={async () => {
              await onDefaultButtonClick();
            }}
            placeholder="Enter your password"
          />
          {error !== '' && <ErrorTxt>{error}</ErrorTxt>}
          <ButtonWithLogo
            mt={34}
            hasLogo={false}
            text="Continue"
            onClick={async () => {
              await onDefaultButtonClick();
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

export default connect(null, mapDispatchToProps)(UnlockUserPage);
