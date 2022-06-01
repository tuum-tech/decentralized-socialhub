import React, { useState } from 'react';

import OwnYourSelf from '../NewUserFlow/OwnYourSelf';
import WelcomeProfile from '../NewUserFlow/WelcomeProfile';
import Web3Storage from '../NewUserFlow/Web3Storage';
import AllIsSet from '../NewUserFlow/AllIsSet';

interface Props {
  sessionItem: ISessionItem;
  close: (step: number) => void;
}

const LoginInWithEssential: React.FC<Props> = ({ sessionItem, close }) => {
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

export default LoginInWithEssential;
