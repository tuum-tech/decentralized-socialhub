import { IonButton } from '@ionic/react';
import React, { useState } from 'react';

import SecurityWordsView from '../SecurityWords/SecurityWordsView';
import SecurityWordsValidate from '../SecurityWords/SecurityWordsValidate';
import arrowback from '../../../../../assets/arrow_back_black.svg';

import { ITutorialStepProp } from './TutorialStep1';

import style from '../style.module.scss';

const TutorialStep2Component: React.FC<ITutorialStepProp> = ({
  onContinue,
  mnemonics = ['', '', '', '', '', '', '', '', '', '', '', '']
}) => {
  const [mnemonic] = useState(mnemonics);
  const [isValid, setIsValid] = useState(false);
  const [isOnError, setIsOnError] = useState(false);

  const [isVerifying, setIsVerifying] = useState(false);

  const viewWords = () => {
    return (
      <div>
        <h2>Decentralized Identity (DID)</h2>
        <p>
          These are your secret keys(also known as 12 word mnemonics) that
          control your Decentralized Identifier (DID). Write these down, in
          order and keep them safe. You own it and you control your DID so if
          you lose these secret keys, you cannot access your profile in the
          future.
        </p>
        <SecurityWordsView mnemonics={mnemonic} />
        <IonButton
          onClick={() => setIsVerifying(true)}
          className={style['tutorial-button']}
        >
          Yes. I have written them down
        </IonButton>
      </div>
    );
  };

  const back = () => {
    setIsVerifying(false);
    setIsOnError(false);
  };

  const onReset = () => {
    setIsValid(false);
    setIsOnError(false);
  };

  const onError = () => {
    setIsValid(false);
    setIsOnError(true);
  };
  const onValid = () => {
    setIsValid(true);
    setIsOnError(false);
  };

  const verifyWords = () => {
    return (
      <div>
        <img
          src={arrowback}
          onClick={() => {
            back();
          }}
        />
        <h2>Re-enter your secret keys(12 word mnemonics)</h2>
        {!isOnError && <p>Please enter your secret keys in the right order</p>}

        <SecurityWordsValidate
          mnemonics={mnemonics}
          onSuccess={() => onValid()}
          onError={() => {
            onError();
          }}
          onReset={() => {
            onReset();
          }}
        />

        <IonButton
          onClick={onContinue}
          className={style['tutorial-button']}
          disabled={!isValid}
        >
          Continue
        </IonButton>
      </div>
    );
  };

  const displayStep = () => {
    if (isVerifying) return verifyWords();
    return viewWords();
  };

  return <div className={style['tutorial-step-2']}>{displayStep()}</div>;
};

export default TutorialStep2Component;
