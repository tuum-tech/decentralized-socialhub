import { IonButton, IonInput, IonList, IonRadio, IonRadioGroup } from '@ionic/react';
import React, { useState } from 'react';
import ButtonDefault from 'src/components/ButtonDefault';
import { ITutorialStepProp } from './TutorialStep1';
import style from '../style.module.scss'
import tuumlogo from '../../../assets/tuumtech.png'
const TutorialStep3Component: React.FC<ITutorialStepProp> = ({ onContinue }) => {

    const [selected, setSelected] = useState("tuum")
    const [hiveUrl, sethiveUrl] = useState("")

    return (
        <div>
            <h2>Decentralized Storage</h2>
            <p>
                You have the chance, whenever, so switch over to your own storage solution. By default you are on a <b>standard package from Tuum Tech</b>. This is a not like a normal server as we do not own or control your data, you do!
        You can learn more on your dashboard, in the settings and completing the beginners tutorial.
            </p>

            <div className={style["tutorial-hive"]}>
                <IonRadioGroup value={selected} onIonChange={(e) => { e.preventDefault(); setSelected(e.detail.value!); e.cancelBubble = true }}>
                    <div className={style["tutorial-hive-row"]}>
                        <IonRadio value="tuum"></IonRadio>
                        <div className={style["tutorial-hive-item"]}>
                            <img src={tuumlogo} />
                            <p>
                                <h2>Tuum Tech</h2>
                                <span>Standard Storage Package</span>
                            </p>
                        </div>
                    </div>
                    <div className={style["tutorial-hive-row"]}>
                        <IonRadio value="other"></IonRadio>
                        <IonInput disabled={selected !== "other"} value={hiveUrl} onIonChange={(e) => { e.preventDefault(); sethiveUrl(e.detail.value!); e.cancelBubble = true }} placeholder="Enter your vault url"></IonInput>
                    </div>
                </IonRadioGroup>
            </div>

            <IonButton onClick={onContinue} className={style["tutorial-button"]}>Continue</IonButton>
        </div>
    );
}

export default TutorialStep3Component;