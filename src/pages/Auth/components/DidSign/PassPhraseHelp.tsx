/**
 * Page
 */

import React, { useState } from 'react';
import { IonButton, IonImg } from '@ionic/react';
import styled from 'styled-components';

import lockImg from '../../../../assets/icon/lock.png';

interface Props {
  close: () => void;
}

const OnBoardingContainer = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.62);
  backdrop-filter: blur(10px);
  z-index: 100;
`;

const OnBoarding = styled.div`
  width: 471px;
  height: 447px;
  z-index: 101;

  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 16px;
  background-color: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);

  text-align: center;
  font-family: 'SF Pro Display';

  padding: 50px 56px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  h1 {
    font-size: 36px;
    line-height: 136.02%;
    font-weight: bold;
    margin: 0;
  }
`;

const TopImg = styled(IonImg)`
  width: 38px;
  display: block;
  margin: 0 auto 19px;
`;

const Content = styled.div`
  padding: 48px 30px 60px;
  flex-grow: 1;

  p {
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 23px;
    text-align: center;
    font-feature-settings: 'salt' on;
    color: #425466;
  }

  .avatar-container {
    padding: 26px;
    margin-bottom: 47px;

    background: #f7fafc;
    border-radius: 16px;
    box-shadow: 0px 3px 8px -1px rgba(50, 50, 71, 0.05);
    filter: drop-shadow(0px 0px 1px rgba(12, 26, 75, 0.24));

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .defaultAdamAvatar {
      width: 90px;
    }

    .name {
      font-family: Inter;
      font-style: normal;
      font-weight: 600;
      font-size: 16px;
      line-height: 25px;
      margin-top: 10px;
      text-align: center;
      color: #1a202c;
    }
    .status {
      font-family: 'SF Pro Display';
      font-style: normal;
      font-weight: normal;
      font-size: 16px;
      line-height: 162.02%;
      text-align: center;
      font-feature-settings: 'salt' on;
      color: #ff5a5a;
    }
  }
`;

const CloseBtn = styled(IonButton)`
  --ion-color-primary: #4c6fff !important;
  --ion-color-primary-tint: #4c7aff;
  background: #4c6fff 0% 0% no-repeat padding-box !important;
  height: 36px;
  min-width: 296px;
  border-radius: 8px;
  opacity: 1;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #ffffff;
`;

const OnBoardingPage: React.FC<Props> = ({ close }) => {
  return (
    <OnBoardingContainer>
      <OnBoarding>
        <div>
          <TopImg src={lockImg} />
          <h1>What is a passphrase?</h1>
        </div>
        <Content>
          <p>
            This is your mnemonic passphrase that you may have used to
            originally create your wallet. Note that this is NOT the same as
            your local password when you create a Profile account
          </p>
        </Content>

        <CloseBtn onClick={close}>Close</CloseBtn>
      </OnBoarding>
    </OnBoardingContainer>
  );
};

export default OnBoardingPage;
