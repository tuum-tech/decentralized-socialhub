import React from 'react';
import { IonButton } from '@ionic/react';
import style from '../style.module.scss';
import { ITutorialStepProp } from './TutorialStep1';

import badge from '../../../assets/TutorialBagde.svg';

const TutorialStep4Component: React.FC<ITutorialStepProp> = ({
  onContinue
}) => {
  return (
    <div>
      <h2>✅ Tutorial Complete</h2>
      <p>
        Your profile is now ready. You have also received a completion badge.
        Thanks for completing the tutorial.{' '}
      </p>

      <div className={style['tutorial-badge']}>
        <img src={badge} />
        <span>Beginner Tutorial</span>
      </div>

      <p className={style['tutorial-complete']}>
        <b>Next steps:</b>&nbsp;You can now access your Profile Manager where
        you can start adding content to your profile.
      </p>
      <IonButton onClick={onContinue} className={style['tutorial-button']}>
        Continue
      </IonButton>
    </div>
  );
};

export default TutorialStep4Component;
