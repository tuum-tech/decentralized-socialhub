/**
 * Page
 */

import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { OnBoardLayout } from 'src/components/layouts/OnBoardLayout';
import Step1 from './components/Step1';
import Step2 from './components/Step2';
import Step3 from './components/Step3';
import Step4 from './components/Step4';
import Step5 from './components/Step5';
import Step6 from './components/Step6';
import Step7 from './components/Step7';

const Steps = [Step1, Step2, Step3, Step4, Step5, Step6, Step7];

const TutorialPage: React.FC = () => {
  const [step, setStep] = useState(0);
  const [back, setBack] = useState(false);
  const nextStep = () => {
    if (step !== 6) {
      setStep(step + 1);
    }
  };
  const prevStep = () => {
    if (step !== 0) {
      setStep(step - 1);
    }
  };
  const StepComp = Steps[step];

  if (back) {
    // this will be replaced with /dashboard later
    return <Redirect to={{ pathname: '/profile' }} />;
  }
  return (
    <OnBoardLayout>
      <StepComp
        next={nextStep}
        prev={prevStep}
        key={step}
        back={() => setBack(true)}
      />
    </OnBoardLayout>
  );
};

export default TutorialPage;
