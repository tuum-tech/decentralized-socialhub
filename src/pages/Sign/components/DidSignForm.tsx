/**
 * Page
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

import ButtonWithLogo from 'src/components/buttons/ButtonWithLogo';
import TextInput from 'src/components/inputs/TextInput';

import style from './DidSignForm.module.scss';

const DidSignFormContainer = styled(IonGrid)`
  width: 100%;
  margin: 35px auto;
`;
const DidInputRow = styled(IonRow)`
  margin-right: -25px;
`;

interface Props {
  setError: (error: boolean) => void;
  error: boolean;
}

const DidForm: React.FC<Props> = ({ error = false, setError }) => {
  const [mnemonic, setMnemonic] = useState([
    'garage',
    'stadium',
    'stand',
    'toy',
    'swap',
    'fish',
    'include',
    'animal',
    'leave',
    'van',
    'moment',
    '',
  ]);

  const isMnemonicWordValid = (index: number): boolean => {
    let word: string = mnemonic[index];
    if (!word) {
      return false;
    }
    return word.trim() !== '';
  };

  const signin = async () => {
    let validate = true;
    for (let i = 0; i < 12; i++) {
      validate = isMnemonicWordValid(i);
    }
    setError(validate === false);
  };

  const updateMnemonic = (index: number, n: string) => {
    mnemonic[index] = n;
    setMnemonic(mnemonic);
  };

  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol className='ion-no-padding'>
        <TextInput
          hasError
          value={mnemonic[index]}
          flexDirection='column'
          label={(index + 1).toString()}
          onChange={(n) => updateMnemonic(index, n)}
        />
      </IonCol>
    );
  };

  const cName = style['didsignform'] + ' ion-no-padding';

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
      <IonRow>
        {error ? (
          <ButtonWithLogo
            mode='danger'
            mt={67}
            text='clear'
            onClick={() => {
              setMnemonic(['', '', '', '', '', '', '', '', '', '', '', '']);
              setError(false);
            }}
          />
        ) : (
          <ButtonWithLogo
            mode='dark'
            mt={67}
            text='Sign in to profile'
            onClick={signin}
          />
        )}
      </IonRow>
    </DidSignFormContainer>
  );
};

export default DidForm;
