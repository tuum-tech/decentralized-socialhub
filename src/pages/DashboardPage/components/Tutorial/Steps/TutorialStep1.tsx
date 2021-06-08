import { IonButton } from '@ionic/react';
import React from 'react';

import style from '../style.module.scss';

export interface ITutorialStepProp {
  onContinue: () => void;
  mnemonics?: string[];
  setLoading?: (status: boolean) => void;
  session: ISessionItem;
}

const TutorialStep1Component: React.FC<ITutorialStepProp> = ({
  onContinue,
  session
}) => {
  return (
    <div>
      <h2>What is Profile?</h2>
      <p>
        Be your own entity online with total control of your digital world, in
        one place. A platform where genuine connections and real-world
        networking online begins. It's free and easy to setup!
      </p>
      {session.isDIDPublished ? (
        <IonButton onClick={onContinue} className={style['tutorial-button']}>
          Continue
        </IonButton>
      ) : (
        <IonButton disabled={true} className={style['tutorial-button']}>
          Please wait for DID to be published first
        </IonButton>
      )}
    </div>
  );
};

export default TutorialStep1Component;
