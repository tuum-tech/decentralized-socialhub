import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';

import style from './style.module.scss';

import TutorialStepsComponent from './TutorialSteps';
import TutorialStep1Component from './Steps/TutorialStep1';
import TutorialStep2Component from './Steps/TutorialStep2';
import TutorialStep3Component from './Steps/TutorialStep3';
import { UserService } from 'src/services/user.service';
import TutorialStep4Component from './Steps/TutorialStep4';

import logo from '../../../../assets/logo_white.svg';

export interface TutorialComponentProps {
  onClose: (step: number) => void;
}

const TutorialComponent: React.FC<TutorialComponentProps> = ({ onClose }) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [mnemonics] = useState<string[]>(
    UserService.GetUserSession()!.mnemonics.split(' ')
  );

  useEffect(() => {
    if (step === 0) {
      const userSession = UserService.GetUserSession();
      if (userSession && userSession.tutorialStep) {
        setStep(userSession.tutorialStep);
      } else {
        setStep(1);
        setLoading(false);
      }
    }
  }, []);

  const stepComponent = () => {
    if (step == 1) return <TutorialStep1Component onContinue={nextStep} />;
    if (step == 2)
      return (
        <TutorialStep2Component onContinue={nextStep} mnemonics={mnemonics} />
      );
    if (step == 3) return <TutorialStep3Component onContinue={nextStep} />;
    return <TutorialStep4Component onContinue={nextStep} />;
  };

  const nextStep = async () => {
    if (step == 4) {
      onClose(step);
    } else {
      setStep(step + 1);
    }
  };

  const colLeftStyle = () => {
    if (step == 1) return style['tutorial-col-left-1'];
    if (step == 2) return style['tutorial-col-left-2'];
    if (step == 3) return style['tutorial-col-left-3'];
    return style['tutorial-col-left-4'];
  };

  return (
    <div className={style['tutorial-component']}>
      <IonGrid>
        <IonRow>
          <IonCol className={colLeftStyle()} size="5">
            <img src={logo} />
            <h2>Quick start</h2>
            <p>
              Learn a little about what Profile is, why you need it, and how
              it’s different to other platforms.
            </p>
            <div className={style['tutorial-left-bottom']}>
              <TutorialStepsComponent step={step} />
              <IonButton
                onClick={() => onClose(step)}
                className={style['tutorial-quit-button']}
              >
                Quit Tutorial
              </IonButton>
            </div>
          </IonCol>
          <IonCol className={style['tutorial-col-right']} size="7">
            {stepComponent()}
          </IonCol>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default TutorialComponent;
