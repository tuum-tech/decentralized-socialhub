import React, { useState } from 'react';

import OwnYourSelf from '../NewUserFlow/OwnYourSelf';
import LoadingModal from '../NewUserFlow/LoadingModal';
import Web3Storage from '../NewUserFlow/Web3Storage';
import AllIsSet from '../NewUserFlow/AllIsSet';

interface Props {
  changeStep: (step: number) => void;
  session: ISessionItem;
  close: (step: number) => void;
  onBoardingInfo: IOnboardingInfo;
}

const LoginInWithEssential: React.FC<Props> = ({
  session,
  close,
  onBoardingInfo,
  changeStep
}: Props) => {
  const step = onBoardingInfo.step;

  const nextStep = async () => {
    await changeStep(step + 1);
  };

  const prevStep = async () => {
    if (step >= 1) {
      await changeStep(step - 1);
    }
  };

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
    return <AllIsSet seeMyBades={() => {}} close={nextStep} share={() => {}} />;
  }
  return <LoadingModal />;
};

export default LoginInWithEssential;
