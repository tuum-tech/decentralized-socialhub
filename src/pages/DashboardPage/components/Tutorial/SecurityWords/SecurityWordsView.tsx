import React, { useState } from 'react';
import styled from 'styled-components';
import { IonGrid, IonRow, IonCol } from '@ionic/react';

import style from './style.module.scss';

const SecurityWordsViewContainer = styled(IonGrid)`
  width: 100%;
  margin: 5px auto;
  margin-left: 25px;
  margin-bottom: 10px;
`;
const SecurityWordsViewRow = styled(IonRow)`
  margin-right: -25px;
`;

interface Props {
  mnemonics: string[];
}

const SecurityWordsView: React.FC<Props> = ({
  mnemonics = ['', '', '', '', '', '', '', '', '', '', '', '']
}) => {
  const [mnemonic] = useState(mnemonics);

  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol className="ion-no-padding">
        <div className={style['security-view-col']}>
          <span className={style['security-view-number']}>
            {(index + 1).toString()}
          </span>
          <div className={style['security-view-word']}>{mnemonic[index]}</div>
        </div>
      </IonCol>
    );
  };

  const cName = style['security-view'] + ' ion-no-padding';
  return (
    <SecurityWordsViewContainer className={cName}>
      <SecurityWordsViewRow>
        {renderMnemonicInput(0)}
        {renderMnemonicInput(1)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow>
        {renderMnemonicInput(2)}
        {renderMnemonicInput(3)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow>
        {renderMnemonicInput(4)}
        {renderMnemonicInput(5)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow>
        {renderMnemonicInput(6)}
        {renderMnemonicInput(7)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow>
        {renderMnemonicInput(8)}
        {renderMnemonicInput(9)}
      </SecurityWordsViewRow>
      <SecurityWordsViewRow>
        {renderMnemonicInput(10)}
        {renderMnemonicInput(11)}
      </SecurityWordsViewRow>
    </SecurityWordsViewContainer>
  );
};

export default SecurityWordsView;
