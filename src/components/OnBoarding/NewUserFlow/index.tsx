import React, { useState } from 'react';

import DownloadEssentials from './DownloadEssentials';
import OwnYourSelf from './OwnYourSelf';
import WelcomeProfile from './WelcomeProfile';
import Web3Identity from './Web3Identity';
import Web3Storage from './Web3Storage';
import ActivateProfile from './ActivateProfile';
import AllIsSet from './AllIsSet';

interface Props {
  sessionItem: ISessionItem;
  close: (step: number) => void;
}

const NewUserFlow: React.FC<Props> = ({ sessionItem, close }) => {
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

export default NewUserFlow;
