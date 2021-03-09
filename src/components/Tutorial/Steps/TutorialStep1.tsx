import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import ButtonDefault from 'src/components/ButtonDefault';
import style from '../style.module.scss'
export interface ITutorialStepProp{
    onContinue: () => void
    mnemonics?: string[]
}

const TutorialStep1Component: React.FC<ITutorialStepProp> = ({onContinue}) => {
    return (
        <div>
            <h2>What is Profile?</h2>
            <p>It's free and easy to get setup</p>

            <IonButton onClick={onContinue} className={style["tutorial-button"]}>Continue</IonButton>
        </div>
    );
}

export default TutorialStep1Component;