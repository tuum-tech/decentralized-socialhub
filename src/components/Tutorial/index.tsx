import React, { useEffect, useState } from 'react';
import { IonContent, IonGrid, IonRow, IonCol, IonButton } from '@ionic/react';
import style from './style.module.scss';
import logo from '../../assets/logo_white.svg';
import TutorialStepsComponent from './TutorialSteps';
import ButtonDefault from '../ButtonDefault';
import TutorialStep1Component from './Steps/TutorialStep1';
import TutorialStep2Component from './Steps/TutorialStep2';
import TutorialStep3Component from './Steps/TutorialStep3';
import { UserService } from 'src/services/user.service';
import { TutorialService } from 'src/services/tutorial.service';
import TutorialStep4Component from './Steps/TutorialStep4';




export interface TutorialComponentProps {
    onClose: () => void
}

const TutorialComponent: React.FC<TutorialComponentProps> = ({ onClose }) => {

    const [step, setStep] = useState(TutorialService.getTutorialStage());
    const [mnemonics] = useState<string[]>(UserService.getLoggedUser().mnemonics.split(" "))

    

    const stepComponent = () => {
        if (step == 1) return (<TutorialStep1Component onContinue={nextStep} />)
        if (step == 2) return (<TutorialStep2Component onContinue={nextStep} mnemonics={mnemonics} />)
        if (step == 3) return (<TutorialStep3Component onContinue={nextStep} />)
        return (<TutorialStep4Component onContinue={nextStep} />)
    }

    const nextStep = () => {

        if (step == 4) {
            TutorialService.dropTutorialStage();
            onClose()
        } else {
            TutorialService.setTutorialStage(step + 1)
            setStep(step + 1)
        }


    }

    const colLeftStyle = () => {
        if (step == 1) return style["tutorial-col-left-1"]
        if (step == 2) return style["tutorial-col-left-2"]
        if (step == 3) return style["tutorial-col-left-3"]
        return style["tutorial-col-left-4"]
    }


    return (
        <div className={style["tutorial-component"]} >
            <IonGrid>
                <IonRow>
                    <IonCol className={colLeftStyle()} size="5">
                        <img src={logo} />
                        <h2>Quick start</h2>
                        <p>Learn a little about what Profile is, why you need it, and how it’s different to other platforms.</p>
                        <div className={style["tutorial-left-bottom"]}>
                            <TutorialStepsComponent step={step} />
                            <IonButton onClick={onClose} className={style["tutorial-quit-button"]}>Quit Tutorial</IonButton>
                        </div>

                    </IonCol>
                    <IonCol className={style["tutorial-col-right"]} size="7">
                        {stepComponent()}
                    </IonCol>
                </IonRow>
            </IonGrid>
        </div>

    )
};

export default TutorialComponent;