import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import { UserService } from 'src/services/user.service';
import style from '../style.module.scss';
export interface ITutorialStepProp {
  onContinue: () => void;
  mnemonics?: string[];
}

const TutorialStep1Component: React.FC<ITutorialStepProp> = ({
  onContinue
}) => {
  const [isDIDPublished] = useState(
    UserService.GetUserSession()!.isDIDPublished
  );

  return (
    <div>
      <h2>What is Profile?</h2>
      <p>It's free and easy to get setup</p>
      {isDIDPublished && (
        <IonButton onClick={onContinue} className={style['tutorial-button']}>
          Continue
        </IonButton>
      )}
      {!isDIDPublished && (
        <IonButton disabled={true} className={style['tutorial-button']}>
          Please wait for DID to be published first
        </IonButton>
      )}
    </div>
  );
};

export default TutorialStep1Component;
