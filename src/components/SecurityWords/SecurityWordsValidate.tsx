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
    const [isReadOnly, setIsReadOnly] = useState(false)
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

        let allFilled = mnemonic.every((word, wordIndex) => {
            return word.length > 0;
        });

        if (allFilled) {
            let isValid = mnemonic.every((word, wordIndex) => {
                return word == securityWords[wordIndex];
            });

            if (isValid) {
                setIsReadOnly(true)
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
                <div className={style["security-view-col"]}>
                    <span className={style["security-view-number"]}>{(index + 1).toString()}</span>
                    <IonInput
                        className={style["security-view-textinput"]}
                        value={mnemonic[index]}
                        readonly={isReadOnly}
                        onIonChange={(n) => updateMnemonic(index, n.detail.value!)}
                    />
                </div>
            </IonCol>
        )
    }

    const cName = style['security-view'] + ' ion-no-padding'
    return (
        <SecurityWordsViewContainer className={cName}>
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

            {
                isOnError && (
                    <SecurityWordsViewRow >


                        <IonCol class="ion-align-self-center">
                            <div className={style["mnemonics-verification-error"]}>
                                <IonItem>
                                    <IonThumbnail slot="start">
                                        <IonImg src={alertIcon}  />
                                    </IonThumbnail>
                                    <IonLabel className={style["item-text"]}>
                                        <h2>Invalid words or order</h2>
                                        <p>Try entering then again</p>
                                    </IonLabel>
                                    <IonLabel slot="end" onClick={clear} className={style["item-clear"]} >Clear all</IonLabel>
                                </IonItem>
                            </div>
                        </IonCol>
                    </SecurityWordsViewRow>
                )
            }

        </SecurityWordsViewContainer>
    )
}

export default SecurityWordsValidate
