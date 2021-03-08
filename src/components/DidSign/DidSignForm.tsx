/**
 * Page
 */

import React, { useState } from 'react'
import styled from 'styled-components'
import { IonGrid, IonRow, IonCol } from '@ionic/react'
import { ElastosClient } from '@elastosfoundation/elastos-js-sdk'

import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo'
import TextInput from 'src/components/inputs/TextInput'

import style from './DidSignForm.module.scss'

const DidSignFormContainer = styled(IonGrid)`
  width: 100%;
  margin: 35px auto;
`
const DidInputRow = styled(IonRow)`
  margin-right: -25px;
`

interface Props {
  setError: (error: boolean) => void
  error: boolean
  onSuccess: (did: string, mnemonic: string) => void
}

const DidForm: React.FC<Props> = ({ error = false, setError, onSuccess }) => {
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

  const isMnemonicWordValid = (index: number): boolean => {
    let word: string = mnemonic[index]
    if (!word) {
      return false
    }
    return word.trim() !== ''
  }

  const signin = async () => {
    let validate = true
    for (let i = 0; i < 12; i++) {
      validate = isMnemonicWordValid(i)
    }
    setError(validate === false)
    if (validate) {
      let userDid = await ElastosClient.did.loadFromMnemonic(
        mnemonic.join(' ')
      )
      if (!userDid || !userDid.did) {
        setError(true)
        return;
      }
      onSuccess(userDid.did, mnemonic.join(' '))
    }
  }

  const updateMnemonic = (index: number, n: string) => {
    mnemonic[index] = n
    setMnemonic(mnemonic)
  }

  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol className='ion-no-padding'>
        <TextInput
          value={mnemonic[index]}
          flexDirection='column'
          label={(index + 1).toString()}
          onChange={(n) => updateMnemonic(index, n)}
        />
      </IonCol>
    )
  }

  const cName = style['didsignform'] + ' ion-no-padding'
  return (
    <DidSignFormContainer className={cName}>
      <DidInputRow>
        {renderMnemonicInput(0)}
        {renderMnemonicInput(1)}
      </DidInputRow>
      <DidInputRow>
        {renderMnemonicInput(2)}
        {renderMnemonicInput(3)}
      </DidInputRow>
      <DidInputRow>
        {renderMnemonicInput(4)}
        {renderMnemonicInput(5)}
      </DidInputRow>
      <DidInputRow>
        {renderMnemonicInput(6)}
        {renderMnemonicInput(7)}
      </DidInputRow>
      <DidInputRow>
        {renderMnemonicInput(8)}
        {renderMnemonicInput(9)}
      </DidInputRow>
      <DidInputRow>
        {renderMnemonicInput(10)}
        <IonCol className='ion-no-padding'>
          <TextInput
            value={mnemonic[11]}
            flexDirection='column'
            label={(11 + 1).toString()}
            onChange={(n) => updateMnemonic(11, n)}
          />
        </IonCol>
      </DidInputRow>
      {error ? (
        <IonRow>
          <IonCol>
            <ButtonWithLogo
              mode='danger'
              mt={67}
              text='Clear all'
              onClick={() => {
                setMnemonic(['', '', '', '', '', '', '', '', '', '', '', ''])
                setError(false)
              }}
            />
          </IonCol>
          <IonCol>
            <ButtonWithLogo
              mode='dark'
              mt={67}
              text='Sign in to profile'
              onClick={signin}
            />
          </IonCol>
        </IonRow>
      ) : (
        <ButtonWithLogo
          mode='dark'
          mt={67}
          text='Sign in to profile'
          onClick={signin}
        />
      )}
    </DidSignFormContainer>
  )
}

export default DidForm
