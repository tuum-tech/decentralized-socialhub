/**
 * Page
 */

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { IonGrid, IonRow, IonCol, IonLabel, IonInput, IonImg, IonItem, IonThumbnail, IonButton } from '@ionic/react'
import alertIcon from '../../assets/alert.png';

import style from './style.module.scss'
import { clear } from 'console';

const SecurityWordsViewContainer = styled(IonGrid)`
  width: 100%;
  margin: 5px auto;
`
const SecurityWordsViewRow = styled(IonRow)`
  width: 100%;
`

interface Props {
    mnemonics: string[]
    onError: () => void
    onSuccess: () => void
    onReset: () => void
}

const SecurityWordsValidate: React.FC<Props> = ({ mnemonics, onError, onSuccess, onReset }) => {

    let timer: any = null;

    const [securityWords] = useState(mnemonics)
    const [isOnError, setIsOnError] = useState(false)
    const [isValid, setIsValid] = useState(false)
    const [mnemonic, setMnemonic] = useState([
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
        '',
    ])

    useEffect(() => {

    });

    const updateMnemonic = (index: number, n: string) => {
        mnemonic[index] = n
        setMnemonic(mnemonic);

        clearTimeout(timer)

        timer = setTimeout(() => {
            validate()
        }, 500);
    }

    const validate = () => {
        if (isOnError) {
            setIsOnError(false);
            onReset()
        }

        if (isValid) {
            setIsValid(false)
            onReset()
        } 

        let allFilled = mnemonic.every((word, wordIndex) => {
            return word.length > 0;
        });

        if (allFilled) {
            let isValidMnemonics = mnemonic.every((word, wordIndex) => {
                return word == securityWords[wordIndex];
            });

            if (isValidMnemonics) {
                setIsValid(true)
                onSuccess()
            } else {
                setIsOnError(true)
                onError()
            }
        } 
    }

    const clear = () => {
        setMnemonic([
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
        ])
    }

    const renderMnemonicInput = (index: number) => {
        return (
            <IonCol className='ion-no-padding'>
                <div className={style["security-view-col"]+ " " + (isOnError? style["security-view-col-error"]:  "")} >
                    <span className={style["security-view-number"]}>{(index + 1).toString()}</span>
                    <IonInput
                        className={style["security-view-textinput"] }
                        value={mnemonic[index]}
                        onIonChange={(n) => updateMnemonic(index, n.detail.value!)}
                    />
                </div>
            </IonCol>
        )
    }

    const cName = style['security-view'] + ' ion-no-padding'
    return (
        <SecurityWordsViewContainer className={cName}>
             {
                isOnError && (
                    <SecurityWordsViewRow >
                        <IonCol class="ion-align-self-center">
                            <p className={style["tutorial-words-error"]}>Invalid words or wrong order. Try entering them again</p>
                            <IonButton  className={style["security-view-error"]} onClick={clear}>Clear All</IonButton>
                        </IonCol>
                    </SecurityWordsViewRow>
                )
            }
            <SecurityWordsViewRow className={style["security-view-row"]} >
                {renderMnemonicInput(0)}
                {renderMnemonicInput(1)}
            </SecurityWordsViewRow>
            <SecurityWordsViewRow className={style["security-view-row"]} >
                {renderMnemonicInput(2)}
                {renderMnemonicInput(3)}
            </SecurityWordsViewRow>
            <SecurityWordsViewRow className={style["security-view-row"]} >
                {renderMnemonicInput(4)}
                {renderMnemonicInput(5)}
            </SecurityWordsViewRow>
            <SecurityWordsViewRow className={style["security-view-row"]} >
                {renderMnemonicInput(6)}
                {renderMnemonicInput(7)}
            </SecurityWordsViewRow>
            <SecurityWordsViewRow className={style["security-view-row"]} >
                {renderMnemonicInput(8)}
                {renderMnemonicInput(9)}
            </SecurityWordsViewRow>
            <SecurityWordsViewRow className={style["security-view-row"]} >
                {renderMnemonicInput(10)}
                {renderMnemonicInput(11)}
            </SecurityWordsViewRow>

           

        </SecurityWordsViewContainer>
    )
}

export default SecurityWordsValidate
