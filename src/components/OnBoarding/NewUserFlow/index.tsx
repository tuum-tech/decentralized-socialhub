import React, { useState } from 'react';

import DownloadEssentials from './DownloadEssentials';
import OwnYourSelf from './OwnYourSelf';
import LoadingModal from './LoadingModal';
import Web3Identity from './Web3Identity';
import Web3Storage from './Web3Storage';
import ActivateProfile from './ActivateProfile';
import AllIsSet from './AllIsSet';

/**
 * 0: own your self
 * 1: download
 * 2: identity
 * 3: activate
 * 4: web3storage
 * 5: all set
 */

interface Props {
  changeStep: (step: number) => void;
  session: ISessionItem;
  close: (step: number) => void;
  onBoardingInfo: IOnboardingInfo;
}

const NewUserFlow: React.FC<Props> = ({
  session,
  close,
  onBoardingInfo,
  changeStep
}) => {
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
      <DownloadEssentials
        next={nextStep}
        close={() => close(step)}
        back={prevStep}
      />
    );
  }

  if (step === 2) {
    return (
      <Web3Identity
        session={session}
        next={nextStep}
        close={() => close(step)}
        back={prevStep}
      />
    );
  }

  if (step === 3) {
    return (
      <Web3Storage
        session={session}
        complete={nextStep}
        close={() => close(step)}
      />
    );
  }

  if (step === 4) {
    return <AllIsSet seeMyBades={() => {}} close={nextStep} share={() => {}} />;
  }

  return <LoadingModal />;
};

export default NewUserFlow;
