import React, { useEffect, useState } from 'react';
import { IonContent } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps } from './types';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';
import { DidService, IDidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';

import NewUserFlow from './NewUserFlow';
import LoginInWithEssential from './LoginInWithEssential';
import RecoverAccountFlow from './RecoverAccountFlow';
import LoadingModal from './NewUserFlow/LoadingModal';
import { OnBoardingService } from 'src/services/onboarding.service';

const DarkTransparentBG = styled(IonContent)`
  --background: url('../../assets/alphabg.png') no-repeat center top / cover;
`;

interface Props extends InferMappedProps {
  onClose: () => void;
}
const OnBoarding: React.FC<Props> = ({ eProps, ...props }: Props) => {
  const [obdInfo, setObdInfo] = useState<IOnboardingInfo | null>(null);

  useEffect(() => {
    if (props.session && props.session.onBoardingInfo) {
      setObdInfo(props.session.onBoardingInfo);
    }
  }, [props.session]);

  const changeStep = async (step: number) => {
    if (obdInfo === null) return;

    let didService: IDidService = await DidService.getInstance();
    let userService = new UserService(didService);

    const newObdInfo = {
      type: obdInfo.type,
      step: step
    };
    const onBoardingCompleted = OnBoardingService.isOnBoardingCompleted(newObdInfo)
    eProps.setSession({
      session: await userService.updateSession(
        {
          ...props.session,
          onBoardingInfo: newObdInfo,
          onBoardingCompleted: onBoardingCompleted
        },
        false
      )
    });
    setObdInfo(newObdInfo);
  };

  const renderModals = () => {
    if (!props.session.isDIDPublished) {
      return <LoadingModal />;
    }

    if (obdInfo) {
      if (obdInfo.type === 1) {
        return (
          <NewUserFlow
            session={props.session}
            close={props.onClose}
            changeStep={changeStep}
            onBoardingInfo={obdInfo}
          />
        );
      } else if (obdInfo.type === 2) {
        return (
          <LoginInWithEssential
            session={props.session}
            close={props.onClose}
            changeStep={changeStep}
            onBoardingInfo={obdInfo}
          />
        );
      }
      return (
        <RecoverAccountFlow
          session={props.session}
          close={props.onClose}
          changeStep={changeStep}
          onBoardingInfo={obdInfo}
        />
      );
    }
  };

  if (!props.session.onBoardingInfo) {
    return <></>;
  }

  return <DarkTransparentBG>{renderModals()}</DarkTransparentBG>;
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

export default connect(mapStateToProps, mapDispatchToProps)(OnBoarding);
