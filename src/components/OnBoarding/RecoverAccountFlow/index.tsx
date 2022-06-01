import React, { useState } from 'react';

import DownloadEssentials from '../NewUserFlow/DownloadEssentials';
import OwnYourSelf from '../NewUserFlow/OwnYourSelf';
import WelcomeProfile from '../NewUserFlow/WelcomeProfile';
import Web3Identity from '../NewUserFlow/Web3Identity';
import Web3Storage from '../NewUserFlow/Web3Storage';
import ActivateProfile from '../NewUserFlow/ActivateProfile';
import AllIsSet from '../NewUserFlow/AllIsSet';

interface Props {
  sessionItem: ISessionItem;
  close: (step: number) => void;
}

const RecoverAccountFlow: React.FC<Props> = ({ sessionItem, close }) => {
  const [step, setStep] = useState(0);

  if (step === 0) {
    return <WelcomeProfile />;
  }

  if (step === 1) {
    return (
      <OwnYourSelf
        next={() => {
          setStep(step + 1);
        }}
        close={() => close(step)}
      />
    );
  }

  if (step === 2) {
    return (
      <DownloadEssentials
        next={() => {
          setStep(step + 1);
        }}
        close={() => close(step)}
        back={() => {
          setStep(step - 1);
        }}
      />
    );
  }

  if (step === 3) {
    return (
      <Web3Identity
        next={() => {
          setStep(step + 1);
        }}
        close={() => close(step)}
        back={() => {
          setStep(step - 1);
        }}
      />
    );
  }

  if (step === 4) {
    return (
      <ActivateProfile
        next={() => {
          setStep(step + 1);
        }}
        close={() => close(step)}
        back={() => {
          setStep(step - 1);
        }}
      />
    );
  }

  if (step === 5) {
    return (
      <Web3Storage
        complete={() => {
          // TODO
          setStep(step + 1);
        }}
        close={() => close(step)}
      />
    );
  }

  return (
    <AllIsSet
      seeMyBades={() => {
        // setStep(step + 1);
      }}
      close={() => close(step)}
      share={() => {
        setStep(step - 1);
      }}
    />
  );
};

export default RecoverAccountFlow;
