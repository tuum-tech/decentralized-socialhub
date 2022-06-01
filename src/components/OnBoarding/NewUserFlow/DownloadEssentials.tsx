import React from 'react';
import styled from 'styled-components';

import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './WelcomeProfile';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';

import downloadQR from 'src/assets/onboarding/download-qr.png';
import googleplay from 'src/assets/googleplay.png';
import appstore from 'src/assets/appstore.png';

export const TransparentWithBorderlineButton = styled.button`
  width: 200px;
  margin-top: 2px;
  height: 39px;

  position: relative;
  padding: 2px;
  box-sizing: border-box;

  border-radius: 9px;
  background: white;

  p {
    font-weight: 500;
    font-size: 14px;
    line-height: 162.02%;
    background: linear-gradient(145.76deg, #995aff 14.97%, #dc59bf 87.23%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    margin: -2px;
    border-radius: inherit;
    background: linear-gradient(145.76deg, #995aff 14.97%, #dc59bf 87.23%);
  }
`;

export const RowContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 20px auto;
  width: 100%;
`;

interface Props {
  next: () => void;
  back: () => void;
  close: () => void;
}

const DownloadEssentials: React.FC<Props> = ({ back, next, close }) => {
  return (
    <OnBoardingContainer style={{ maxWidth: '545px' }}>
      <TutorialSteps step={1} />
      <OnBoardingTitle>Download Essentials App</OnBoardingTitle>

      <img
        src={downloadQR}
        alt="download"
        style={{ display: 'block', margin: '20px auto', width: '188px' }}
      />

      <p
        style={{
          fontSize: '16px',
          lineHeight: '162.02%',
          color: '#27272E'
        }}
      >
        Download the Essentials wallet app to backup, login, and unlock all the
        features Profile offers.
      </p>

      <RowContainer style={{ maxWidth: '230px' }}>
        <img src={appstore} alt="appstore" width="100px" />
        <img src={googleplay} alt="googleplay" width="100px" />
      </RowContainer>

      <RowContainer style={{ maxWidth: '380px' }}>
        <TransparentWithBorderlineButton
          onClick={back}
          style={{ width: '150px' }}
        >
          <p>Back</p>
        </TransparentWithBorderlineButton>
        <ThemeButton
          style={{ width: '150px', fontSize: '14px' }}
          onClick={next}
          text="Next Step"
        />
      </RowContainer>

      <TransparentButton onClick={close}>
        <p>Skip for now</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default DownloadEssentials;
