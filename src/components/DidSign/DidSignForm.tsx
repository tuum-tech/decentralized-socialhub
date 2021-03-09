/**
 * Page
 */

import React, { useState } from 'react'
import styled from 'styled-components'
import { IonGrid, IonRow, IonCol } from '@ionic/react'
import { ElastosClient } from '@elastosfoundation/elastos-js-sdk'

import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo'
import TextInput from 'src/components/inputs/TextInput'
import { Text16 } from 'src/components/texts'
import { DidService } from 'src/services/did.service'

import style from './DidSignForm.module.scss'

const DidSignFormContainer = styled(IonGrid)`
  width: 100%;
  margin: 25px auto;
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

  const [passphrase, setPassphrase] = useState('')

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
        mnemonic.join(' '),
        passphrase || ''
      )
      if (!userDid || !userDid.did) {
        setError(true)
        return
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
        {renderMnemonicInput(11)}
      </DidInputRow>

      <DidInputRow>
        <IonCol className='ion-no-padding mt-25px'>
          <Text16> Enter your Passphrase. </Text16>
        </IonCol>
      </DidInputRow>

      <DidInputRow>
        <IonCol className='ion-no-padding'>
          <TextInput
            flexDirection='column'
            className='mt-12px'
            value={passphrase}
            onChange={(n) => setPassphrase(n)}
          />
        </IonCol>
      </DidInputRow>
      {error ? (
        <IonRow>
          <IonCol>
            <ButtonWithLogo
              mode='danger'
              mt={27}
              text='Clear'
              onClick={() => {
                setMnemonic(['', '', '', '', '', '', '', '', '', '', '', ''])
                setError(false)
              }}
            />
          </IonCol>
          <IonCol>
            <ButtonWithLogo
              mode='dark'
              mt={27}
              text='Sign in to profile'
              onClick={signin}
            />
          </IonCol>
        </IonRow>
      ) : (
        <ButtonWithLogo
          mode='dark'
          mt={27}
          text='Sign in to profile'
          onClick={signin}
        />
      )}
    </DidSignFormContainer>
  )
}

export default DidForm
