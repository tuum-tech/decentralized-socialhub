import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import style from '../style.module.scss'
import { ITutorialStepProp } from './TutorialStep1';


const TutorialStep4Component: React.FC<ITutorialStepProp> = ({onContinue}) => {
    return (
        <div>
            <h2>Tutorial Complete</h2>
            <p>Congratulations, you complete the beginner tutorial</p>

            <IonButton onClick={onContinue} className={style["tutorial-button"]}>Finish</IonButton>
        </div>
    );
}

export default TutorialStep4Component;