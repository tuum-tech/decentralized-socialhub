import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { IonGrid, IonRow, IonCol, IonInput, IonButton } from '@ionic/react';

import style from './style.module.scss';

const SecurityWordsViewContainer = styled(IonGrid)`
  width: 100%;
  margin: 5px auto;
`;
const SecurityWordsViewRow = styled(IonRow)`
  width: 100%;
`;

interface Props {
  mnemonics: string[];
  onError: () => void;
  onSuccess: () => void;
  onReset: () => void;
}

const SecurityWordsValidate: React.FC<Props> = ({
  mnemonics,
  onError,
  onSuccess,
  onReset
}) => {
  // let timer: any = null;

  const [securityWords] = useState(mnemonics);
  const [isOnError, setIsOnError] = useState(false);
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {});

  const validate = () => {
    if (isOnError) {
      setIsOnError(false);
      onReset();
    }
    if (isValid) {
      setIsValid(false);
      onReset();
    }
    const mnemonic = itemEls.current.map(el => {
      return el.value;
    });
    let allFilled = mnemonic.every((word, wordIndex) => {
      return word.length > 0;
    });
    if (!allFilled) return;
    let isValidMnemonics = mnemonic.every((word, wordIndex) => {
      return word === securityWords[wordIndex];
    });

    if (isValidMnemonics) {
      setIsValid(true);
      onSuccess();
    } else {
      setIsOnError(true);
      onError();
    }
  };

  const itemEls = useRef<any[]>([]);

  const clear = () => {
    itemEls.current.forEach(el => {
      el.value = '';
    });
    setIsOnError(false);
    onReset();
  };

  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol className="ion-no-padding">
        <div
          className={
            style['security-view-col'] +
            ' ' +
            (isOnError ? style['security-view-col-error'] : '')
          }
        >
          <span className={style['security-view-number']}>
            {(index + 1).toString()}
          </span>
          <IonInput
            ref={element => itemEls.current.push(element)}
            className={style['security-view-textinput']}
            onKeyUp={e => {
              let val = e.currentTarget.value! as string;
              if (val.split(' ').length === 12) {
                let words = val.split(' ');
                // eslint-disable-next-line
                itemEls.current.map((el, index) => {
                  el.value = words[index];
                });
              } else {
                let value = val.replace(/\s+/g, '');
                let key = e.key;
                if (key === ' ') {
                  itemEls.current[index].value = value;
                  itemEls.current[(index + 1) % 12].setFocus();
                }
                validate();
              }
            }}
          />
        </div>
      </IonCol>
    );
  };

  const cName = style['security-view'] + ' ion-no-padding';
  return (
    <SecurityWordsViewContainer className={cName}>
      {isOnError && (
        <SecurityWordsViewRow>
          <IonCol class="ion-align-self-center">
            <p className={style['tutorial-words-error']}>
              Invalid words or wrong order. Try entering them again
            </p>
            <IonButton className={style['security-view-error']} onClick={clear}>
              Clear All
            </IonButton>
          </IonCol>
        </SecurityWordsViewRow>
      )}
      <SecurityWordsViewRow className={style['security-view-row']}>
        {renderMnemonicInput(0)}
        {renderMnemonicInput(1)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow className={style['security-view-row']}>
        {renderMnemonicInput(2)}
        {renderMnemonicInput(3)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow className={style['security-view-row']}>
        {renderMnemonicInput(4)}
        {renderMnemonicInput(5)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow className={style['security-view-row']}>
        {renderMnemonicInput(6)}
        {renderMnemonicInput(7)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow className={style['security-view-row']}>
        {renderMnemonicInput(8)}
        {renderMnemonicInput(9)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow className={style['security-view-row']}>
        {renderMnemonicInput(10)}
        {renderMnemonicInput(11)}
      </SecurityWordsViewRow>
    </SecurityWordsViewContainer>
  );
};

export default SecurityWordsValidate;
