import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { InferMappedProps } from '../../types';
import { setSession } from 'src/store/users/actions';

import LoadingIndicator from 'src/elements/LoadingIndicator';
import TutorialStepsComponent from './TutorialSteps';
import TutorialStep1Component from './Steps/TutorialStep1';
import TutorialStep2Component from './Steps/TutorialStep2';
import TutorialStep3Component from './Steps/TutorialStep3';
import { UserService } from 'src/services/user.service';
import TutorialStep4Component from './Steps/TutorialStep4';
import style from './style.module.scss';

import logo from '../../../../assets/logo/logo_white.svg';
import { DidService } from 'src/services/did.service.new';

interface TutorialComponentProps extends InferMappedProps {
  onClose: () => void;
  session: ISessionItem;
}

const NoPaddingGrid = styled(IonGrid)`
  padding: 0 !important;
  overflow-y: auto !important;
`;

const TutorialComponent: React.FC<TutorialComponentProps> = ({
  eProps,
  ...props
}: TutorialComponentProps) => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mnemonics] = useState<string[]>(props.session.mnemonics.split(' '));

  useEffect(() => {
    if (step === 0) {
      if (props.session && props.session.tutorialStep) {
        setStep(props.session.tutorialStep);
      } else {
        setStep(1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextStep = async (session: ISessionItem | null = null) => {
    setLoading(true);
    let newSession = JSON.parse(
      JSON.stringify(session ? session : props.session)
    );

    if (step !== 4 && newSession) {
      newSession.tutorialStep = step + 1;
      if (newSession.tutorialStep === 4) {
        newSession.badges!.account!.beginnerTutorial.archived = new Date().getTime();
      }

      let userService = new UserService(await DidService.getInstance());
      const updatedSession = await userService.updateSession(newSession);
      eProps.setSession({ session: updatedSession });

      setStep(step + 1);
    } else {
      props.onClose();
    }
    setLoading(false);
  };

  const colLeftStyle = () => {
    if (step === 1) return style['tutorial-col-left-1'];
    if (step === 2) return style['tutorial-col-left-2'];
    if (step === 3) return style['tutorial-col-left-3'];
    return style['tutorial-col-left-4'];
  };

  const stepComponent = () => {
    if (step === 1)
      return (
        <TutorialStep1Component session={props.session} onContinue={nextStep} />
      );
    if (step === 2)
      return (
        <TutorialStep2Component
          session={props.session}
          onContinue={nextStep}
          mnemonics={mnemonics}
        />
      );
    if (step === 3)
      return (
        <TutorialStep3Component
          session={props.session}
          onContinue={nextStep}
          setLoading={setLoading}
        />
      );
    return (
      <TutorialStep4Component session={props.session} onContinue={nextStep} />
    );
  };

  return (
    <div className={style['tutorial-component']}>
      {loading && <LoadingIndicator loadingText="In progress..." />}
      <NoPaddingGrid>
        <IonRow>
          <IonCol className={colLeftStyle()} size="5">
            <img alt="logo" src={logo} />
            <h2>Quick start</h2>
            <p>
              Learn a little about what Profile is, why you need it, and how
              it’s different to other platforms.
            </p>
            <div className={style['tutorial-left-bottom']}>
              <TutorialStepsComponent step={step} />
              <IonButton
                onClick={() => props.onClose()}
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
      </NoPaddingGrid>
    </div>
  );
};

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(null, mapDispatchToProps)(TutorialComponent);

// export default TutorialComponent;
