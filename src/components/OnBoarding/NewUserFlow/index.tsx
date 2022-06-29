import React from 'react';
import { useHistory } from 'react-router-dom';

import DownloadEssentials from './DownloadEssentials';
import OwnYourSelf from './OwnYourSelf';
import LoadingModal from './LoadingModal';
import Web3Identity from './Web3Identity';
import Web3Storage from './Web3Storage';
import AllIsSet from './AllIsSet';
import { showNotify } from 'src/utils/notify';
import { getDIDString } from 'src/utils/did';

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
  setCurrentTab: (active: string) => void;
}

const NewUserFlow: React.FC<Props> = ({
  session,
  close,
  onBoardingInfo,
  changeStep,
  setCurrentTab
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

  const seeMyBades = async () => {
    await changeStep(step + 1);
    setCurrentTab('badges');
  };

  const shareLink = async () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `${process.env.REACT_APP_PROFILE_LANDING_PAGE}` +
          getDIDString('/did/' + session.did)
      );
      showNotify(`Copied Profile URL`, 'success');
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
    return (
      <AllIsSet seeMyBades={seeMyBades} close={nextStep} share={shareLink} />
    );
  }

  return <LoadingModal />;
};

export default NewUserFlow;
