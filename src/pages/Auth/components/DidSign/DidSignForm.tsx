/**
 * Page
 */

import React, { useState, useRef } from 'react';
import styled from 'styled-components';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

import {
  OnBoardLayoutRightContent,
  OnBoardLayoutRightContentTitle
} from 'src/components/layouts/OnBoardLayout';

import TextInput from 'src/elements/inputs/TextInput';
import MnemonicInput from 'src/elements/inputs/MnemonicInput';
import { Text16, Text12 } from 'src/elements/texts';
import { ThemeButton } from 'src/elements/buttons';

import helpSvg from '../../../../assets/icon/help.svg';
import style from './DidSignForm.module.scss';
import { DidService } from 'src/services/did.service.new';

const ClearButton = styled.div`
  align-items: center;
  padding: 12px 20px;

  margin: 0 0 0 auto;
  width: 85px;
  height: 36px;

  background: #ff5a5a;
  border-radius: 6px;

  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;
const PassphraseText = styled(IonCol)`
  display: flex;
  img {
    margin-left: 10px;
  }
`;

const DidSignFormContainer = styled(IonGrid)`
  width: 100%;
  margin: 25px auto;
`;
const DidInputRow = styled(IonRow)`
  margin-right: -25px;
`;

interface Props {
  setError: (error: boolean) => void;
  loadDidFunction: (mnemonic: string, password: string) => any;
  error: boolean;
  onSuccess: (did: string, mnemonic: string) => void;
  showModal: () => void;
}

const PlaceHolderTexts = [
  'Enter first word',
  'Enter second word',
  'Enter third word',
  'Enter fourth word',
  'Enter fifth word',
  'Enter sixth word',
  'Enter seventh word',
  'Enter eightth word',
  'Enter ninth word',
  'Enter tenth word',
  'Enter eleventh word',
  'Enter twelfth word'
];

const DidForm: React.FC<Props> = ({
  error = false,
  loadDidFunction,
  setError,
  onSuccess,
  showModal
}) => {
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
    ''
  ]);

  const itemEls = useRef<any[]>([]);

  const [passphrase, setPassphrase] = useState('');

  const signin = async () => {
    let didService = await DidService.getInstance();
    const mnemonic = itemEls.current.map(el => {
      return el.value;
    });
    if (mnemonic.length > 12) mnemonic.pop();
    let isMnemonicValid = didService.isMnemonicsValid(mnemonic.join(' '));
    setError(isMnemonicValid === false);
    if (isMnemonicValid) {
      let userDid = await didService.loadDid(
        mnemonic.join(' '),
        passphrase || ''
      );
      if (!userDid) {
        setError(true);
        return;
      }
      onSuccess(userDid.toString(), mnemonic.join(' '));
    }
  };

  const updateMnemonic = (index: number, n: string) => {
    mnemonic[index] = n;
    setMnemonic(mnemonic);
  };

  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol className="ion-no-padding">
        <MnemonicInput
          onRef={element => itemEls.current.push(element)}
          value={mnemonic[index]}
          flexDirection="column"
          label={(index + 1).toString()}
          placeholder={PlaceHolderTexts[index]}
          onInput={e => {
            setError(false);
            if (e.currentTarget.value!.split(' ').length === 12) {
              let words = e.currentTarget.value!.split(' ');
              setMnemonic(words);
              itemEls.current[12].setFocus();
            } else {
              let val = e.currentTarget.value!.replace(/\s+/g, '');
              let key = e.key;
              if (key === ' ') {
                itemEls.current[index].value = val;
                itemEls.current[(index + 1) % 12].setFocus();
              }
              updateMnemonic(index, val);
            }
          }}
          hasError={error}
        />
      </IonCol>
    );
  };

  const cName = style['didsignform'] + ' ion-no-padding';
  return (
    <OnBoardLayoutRightContent>
      <OnBoardLayoutRightContentTitle>
        Recover with Decentralized ID (DID)
      </OnBoardLayoutRightContentTitle>
      <Text16>Enter your 12 security passwords in the correct order.</Text16>
      <IonRow style={{ marginTop: '12px' }}>
        <IonCol style={{ paddingLeft: '0px' }}>
          <Text12>What are these?&nbsp;Help</Text12>
        </IonCol>
        {error && (
          <IonCol>
            <ClearButton
              onClick={() => {
                setMnemonic(['', '', '', '', '', '', '', '', '', '', '', '']);
                setError(false);
              }}
            >
              Clear All
            </ClearButton>
          </IonCol>
        )}
      </IonRow>
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
          <PassphraseText className="ion-no-padding mt-25px">
            <Text16> Passphrase (Optional) </Text16>
            <img src={helpSvg} alt="help" width={13} onClick={showModal} />
          </PassphraseText>
        </DidInputRow>

        <DidInputRow>
          <IonCol className="ion-no-padding">
            <TextInput
              onRef={element => itemEls.current.push(element)}
              flexDirection="column"
              className="mt-12px"
              value={passphrase}
              placeholder="Enter your passphrase here"
              onHitEnter={signin}
              onChange={n => setPassphrase(n)}
            />
          </IonCol>
        </DidInputRow>
        <ThemeButton
          style={{ marginTop: '20px' }}
          onClick={signin}
          text="Recover Account"
        />
      </DidSignFormContainer>
    </OnBoardLayoutRightContent>
  );
};

export default DidForm;
