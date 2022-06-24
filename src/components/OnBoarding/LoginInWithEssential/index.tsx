import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { showNotify } from 'src/utils/notify';
import OwnYourSelf from '../NewUserFlow/OwnYourSelf';
import LoadingModal from '../NewUserFlow/LoadingModal';
import Web3Storage from '../NewUserFlow/Web3Storage';
import AllIsSet from '../NewUserFlow/AllIsSet';
import { getDIDString } from 'src/utils/did';

interface Props {
  changeStep: (step: number) => void;
  session: ISessionItem;
  close: (step: number) => void;
  onBoardingInfo: IOnboardingInfo;
  setCurrentTab: (active: string) => void;
}

const LoginInWithEssential: React.FC<Props> = ({
  session,
  close,
  onBoardingInfo,
  changeStep,
  setCurrentTab
}: Props) => {
  const step = onBoardingInfo.step;
  const history = useHistory();

  const nextStep = async () => {
    await changeStep(step + 1);
  };

  const prevStep = async () => {
    if (step >= 1) {
      await changeStep(step - 1);
    }
  };

  const seeMyBades = async () => {
    await changeStep(step + 1);
    setCurrentTab('badges');
  }

  const shareLink = async () => {
    await changeStep(step + 1);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${process.env.REACT_APP_TUUM_TECH_HIVE}` + getDIDString('/did/' + session.did));
      showNotify(`Copied Profile URL`, 'success');
    }
  }

  if (step === 0) {
    return <OwnYourSelf next={nextStep} close={() => close(step)} />;
  }

  if (step === 1) {
    return (
      <Web3Storage
        session={session}
        complete={nextStep}
        close={() => close(step)}
      />
    );
  }

  if (step === 2) {
    return <AllIsSet seeMyBades={seeMyBades} close={nextStep} share={shareLink} />;
  }
  return <LoadingModal />;
};

export default LoginInWithEssential;
