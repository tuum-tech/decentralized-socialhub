import { IonButton, IonInput, IonList, IonRadio, IonRadioGroup } from '@ionic/react';
import React, { useState } from 'react';
import ButtonDefault from 'src/components/ButtonDefault';
import { ITutorialStepProp } from './TutorialStep1';
import style from '../style.module.scss'
import tuumlogo from '../../../assets/tuumtech.png'
import { DidService, PublishRequestOperation } from 'src/services/did.service';
import { UserService } from 'src/services/user.service';
import { HiveService } from 'src/services/hive.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { UserVaultScripts } from 'src/scripts/uservault.script';
import { AssistService } from 'src/services/assist.service';
const TutorialStep3Component: React.FC<ITutorialStepProp> = ({ onContinue }) => {


    const [hiveUrl, sethiveUrl] = useState("")
    const [hiveDocument] = useState("")

    const [errorMessage, setErrorMessage] = useState("")

    const [selected, setSelected] = useState(hiveDocument === "" ? "tuum" : "document")

    const getEndpoint = () => {
        if (selected === "document") return hiveDocument;
        if (selected === "tuum") return `${process.env.REACT_APP_TUUM_TECH_HIVE}`;
        return hiveUrl
    }

    const isEndpointValid = (endpoint: string) => {
        if (!endpoint || endpoint.length == 0) return false
        let regexp = new RegExp(
            /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
        )
        return regexp.test(endpoint)
    }

    const saveSelection = async () => {
        setErrorMessage("")
        let endpoint = getEndpoint();
        let endpointValid = isEndpointValid(endpoint)

        if (!endpointValid) {
            setErrorMessage("Invalid hive address")
            return
        }

        let isValidHiveAddress = await HiveService.isHiveAddressValid(endpoint)
        if (!isValidHiveAddress) {
            setErrorMessage("Invalid hive address")
            return
        }

        try {
            
            let user = UserService.GetUserSession()
            user.userToken = await generateUserToken(user.mnemonics, endpoint)
            user.tutorialCompleted = true
            user.hiveHost = endpoint;

            let userDid = await DidService.loadDid(user.mnemonics)
            let hivesvc = DidService.generateService(userDid, "HiveVault", endpoint)
            let userDocument = await (await DidDocumentService.getUserDocument()).diddocument
            DidService.addServiceToDIDDocument(userDocument, hivesvc)
            DidDocumentService.publishUserDocument(userDocument)  
            UserService.updateSession(user)

            let hiveInstance = await HiveService.getSessionInstance()
            await UserVaultScripts.Execute(hiveInstance!)
            
            
            onContinue()
        } catch (error) {
            console.log("Error", error)
            await DidDocumentService.reloadUserDocument()
            setErrorMessage("We are not able to process your request at moment. Please try again later")
        }


    }

    const generateUserToken = async (mnemonics: string, address: string)=>{
        let challenge = await HiveService.getHiveChallenge(address)
        let presentation = await DidService.generateVerifiablePresentationFromUserMnemonics(
        mnemonics,
        '',
        challenge.issuer,
        challenge.nonce
        )
        return await HiveService.getUserHiveToken(address, presentation)
    }


    return (
        <div>
            <h2>Decentralized Storage</h2>
            <p>
                You have the chance, whenever, so switch over to your own storage solution. By default you are on a <b>standard package from Tuum Tech</b>. This is a not like a normal server as we do not own or control your data, you do!
        You can learn more on your dashboard, in the settings and completing the beginners tutorial.
            </p>

            <div className={style["tutorial-hive"]}>
                <IonRadioGroup value={selected} onIonChange={(e) => { e.preventDefault(); setSelected(e.detail.value!); e.cancelBubble = true }}>
                    {hiveDocument !== "" && (
                        <div className={style["tutorial-hive-row"]}>
                            <IonRadio value="document"></IonRadio>

                            <div className={style["tutorial-hive-item"]}>
                                <p>
                                    <h3>{hiveDocument}</h3>
                                    <span>Using the default detected vault</span>
                                </p>
                            </div>
                        </div>
                    )}



                    <div className={style["tutorial-hive-row"]}>
                        <IonRadio value="tuum"></IonRadio>

                        <div className={style["tutorial-hive-item"]}>
                            <img src={tuumlogo} />
                            <p>
                                <h2>Tuum Tech</h2>
                            </p>
                        </div>
                    </div>
                    <div className={style["tutorial-hive-row"]}>
                        <IonRadio value="other"></IonRadio>
                        <IonInput disabled={selected !== "other"} value={hiveUrl} onIonChange={(e) => { e.preventDefault(); sethiveUrl(e.detail.value!); e.cancelBubble = true }} placeholder="Enter your vault url"></IonInput>
                    </div>
                </IonRadioGroup>
            </div>
            {errorMessage !== "" && (<div className={style["tutorial-step3-error"]}>{errorMessage}</div>)}
            <IonButton onClick={saveSelection} className={style["tutorial-button"]}>Continue</IonButton>
        </div>
    );
}

export default TutorialStep3Component;