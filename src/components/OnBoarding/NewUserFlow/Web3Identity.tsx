import React from 'react';
import styled from 'styled-components';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './WelcomeProfile';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';
import {
  TransparentWithBorderlineButton,
  RowContainer
} from './DownloadEssentials';

const Word = styled.div`
  width: 100%;
  margin-left: 5px;

  height: 42px;

  background: #edf2f7;

  box-shadow: 0px 1px 2px rgba(50, 50, 71, 0.08),
    0px 0px 1px rgba(50, 50, 71, 0.2);
  border-radius: 6px;

  font-size: 14px;
  line-height: 42px;
`;

const DisplayInfo = styled.div`
  background: rgba(229, 187, 255, 0.16);
  border-radius: 9px;

  padding: 10px;
  width: 100%;

  p {
    font-weight: 600;
    font-size: 13px;
    line-height: 160%;

    text-align: center;

    background: linear-gradient(90deg, #995aff 0%, #dc59bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

interface Props {
  next: () => void;
  back: () => void;
  close: () => void;
}
const Web3Identity: React.FC<Props> = ({ back, next, close }) => {
  const renderMnemonicInput = (index: number) => {
    return (
      <IonCol
        className="ion-no-padding"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around'
        }}
      >
        <span style={{ width: '25px' }}>{(index + 1).toString()}</span>
        <Word>word</Word>
      </IonCol>
    );
  };
  return (
    <OnBoardingContainer style={{ maxWidth: '545px' }}>
      <TutorialSteps step={2} />
      <OnBoardingTitle>Your Web3 Identity</OnBoardingTitle>

      <p
        style={{
          fontSize: '14px',
          lineHeight: '22px',
          color: '#27272E'
        }}
      >
        Your 12 secret words ("mnemonics" in web3 lingo) control your new
        Decentralized ID (DID). Open your Essentials app, select New Identity,
        and import your words to backup your account and activate your Profile.
      </p>

      <IonGrid>
        <IonRow>
          <IonCol>{renderMnemonicInput(1)}</IonCol>
          <IonCol>{renderMnemonicInput(2)}</IonCol>
          <IonCol>{renderMnemonicInput(3)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderMnemonicInput(4)}</IonCol>
          <IonCol>{renderMnemonicInput(5)}</IonCol>
          <IonCol>{renderMnemonicInput(6)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderMnemonicInput(7)}</IonCol>
          <IonCol>{renderMnemonicInput(8)}</IonCol>
          <IonCol>{renderMnemonicInput(9)}</IonCol>
        </IonRow>
        <IonRow>
          <IonCol>{renderMnemonicInput(10)}</IonCol>
          <IonCol>{renderMnemonicInput(11)}</IonCol>
          <IonCol>{renderMnemonicInput(12)}</IonCol>
        </IonRow>
      </IonGrid>

      <DisplayInfo>
        <p>
          Do not share your secret words with anyone & keep a backup in a secure
          location!
        </p>
      </DisplayInfo>

      <RowContainer style={{ maxWidth: '380px' }}>
        <TransparentWithBorderlineButton
          style={{ width: '170px' }}
          onClick={back}
        >
          <p>Back</p>
        </TransparentWithBorderlineButton>
        <ThemeButton
          style={{ width: '170px', fontSize: '14px' }}
          onClick={next}
          text="Activate Profile"
        />
      </RowContainer>
      <TransparentButton onClick={close}>
        <p>Skip for now</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default Web3Identity;
