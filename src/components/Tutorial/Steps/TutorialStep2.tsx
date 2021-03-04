import { IonButton } from '@ionic/react';
import React, { useState } from 'react';
import ButtonDefault from 'src/components/ButtonDefault';
import { ITutorialStepProp } from './TutorialStep1';
import style from '../style.module.scss'
import SecurityWordsView from 'src/components/SecurityWords/SecurityWordsView';
import SecurityWordsValidate from 'src/components/SecurityWords/SecurityWordsValidate';
import arrowback from '../../../assets/arrow_back_black.svg';
const TutorialStep2Component: React.FC<ITutorialStepProp> = ({onContinue, mnemonics=["", "", "", "", "", "", "", "", "", "", "", ""]}) => {

    const [mnemonic] = useState(mnemonics)
    const [isValid, setIsValid] = useState(false)
    const [isOnError, setIsOnError] = useState(false)

    const [isVerifying, setIsVerifying] = useState(false)

    const viewWords = () =>{
       return ( <div>
            <h2>Decentralized Identity (DID)</h2>
            <p>This is your Decentralized Identity (DID). It’s 12 security words in order, that keep your profile safe. Write these down, in order and keep them safe. You lose these and you lose this identity.</p>
            <SecurityWordsView mnemonics={mnemonic} />
            <IonButton onClick={() => setIsVerifying(true)} className={style["tutorial-button"]}>Yes. I have written them down</IonButton>
        </div>)
    }

    const back=()=>{
        setIsVerifying(false);
        setIsOnError(false);
    }

    const verifyWords = () =>{
        return (<div>
            {!isValid && (<img src={arrowback} onClick={()=>{back()}} />)}   
            <h2>Re-enter your Security passwords</h2>
            {!isOnError && (<p>Please enter your security words in the right order</p>)}
            {isOnError && (<p className={style["tutorial-words-error"]}>Invalid words or wrong order. Try entering them again</p>)}
            <SecurityWordsValidate mnemonics={mnemonics} onSuccess={() => setIsValid(true)} onError={()=>{setIsOnError(true)}} onReset={()=>{setIsOnError(false)}}   />
                                   
            <IonButton onClick={onContinue} className={style["tutorial-button"]} disabled={!isValid} >Continue</IonButton>
        </div>)
    }

    const displayStep = () =>{
        if (isVerifying) return verifyWords()
        return viewWords()
    }

    return (
        <div className={style["tutorial-step-2"]}>
            {displayStep()}        
        </div>
    );
}

export default TutorialStep2Component;