import React from 'react';
import styled from 'styled-components';
import { IonRadioGroup, IonRadio } from '@ionic/react';

import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './WelcomeProfile';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';

import tuumlogo from '../../../assets/tuumtech.png';

const Intro = styled.p`
  font-size: 14px;
  line-height: 22px;
  color: #27272e;

  span {
    background: linear-gradient(90deg, #995aff 0%, #dc59bf 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

const VaultContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 40px;
  margin-bottom: 60px;

  .content {
    padding: 17px;
    margin-left: 18px;

    background: linear-gradient(
      252.79deg,
      rgba(144, 75, 255, 0.084) -20.69%,
      rgba(190, 52, 160, 0.092) 151.16%
    );
    border-radius: 16px;

    position: relative;
    display: flex;
    align-items: center;
    width: calc(100% - 60px);

    img {
      float: left;
      display: inline;
      border: 1px solid #ff9840;
      border-radius: 19px;
      width: 55px;
      padding: 2px;
      margin-right: 17px;
    }

    .top {
      font-weight: 600;
      font-size: 22px;
      line-height: 22px;

      color: #27272e;
      text-align: left;
    }

    .bottom {
      font-weight: 600;
      font-size: 14px;
      line-height: 14px;

      color: #a0aec0;
      text-align: left;
    }
  }
`;

const VersionTag = styled.div`
  position: absolute;
  right: 5px;
  top: calc(50% - 11px);

  p {
    background: #cbd5e0;
    border-radius: 10px;
    padding: 5px;

    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 12px;
    color: #4a5568;
  }
`;

interface Props {
  complete: () => void;
  close: () => void;
}

const Web3Storage: React.FC<Props> = ({ complete, close }) => {
  return (
    <OnBoardingContainer style={{ maxWidth: '565px' }}>
      <TutorialSteps step={4} />
      <OnBoardingTitle>Your Web3 Storage</OnBoardingTitle>

      <Intro>
        For the first time, you can truly own your own data by now determinig
        how and where stored - all without a middle man. Simply choose the
        default option or your own <span>Elastos Hive Node</span>.
      </Intro>

      <VaultContainer>
        <IonRadioGroup value="tuum">
          <IonRadio value="tuum"></IonRadio>
        </IonRadioGroup>

        <div className="content">
          <img alt="tuum logo" src={tuumlogo} />
          <div>
            <p className="top">Tuum Tech</p>
            <p className="bottom">Default</p>
          </div>
          <VersionTag>
            <p>v2.3.4</p>
          </VersionTag>
        </div>
        <IonRadio value="tuum" style={{ marginLeft: '2px' }}></IonRadio>
      </VaultContainer>

      <ThemeButton
        style={{ width: '200px', fontSize: '16px', margin: '20px auto' }}
        onClick={() => {}}
        text="Complete"
      />
      <TransparentButton>
        <p>Skip for now</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default Web3Storage;
