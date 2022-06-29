import React from 'react';
import styled from 'styled-components';

import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingContainer, OnBoardingTitle } from './LoadingModal';

export const TransparentButton = styled.button`
  background: transparent;
  width: 200px;
  height: 43px;
  padding: 0;

  p {
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 500;
    font-size: 14px;
    line-height: 43px;

    background: linear-gradient(145.76deg, #995aff 14.97%, #dc59bf 87.23%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-fill-color: transparent;
  }
`;

interface Props {
  next: () => void;
  close: () => void;
}

const OwnYourSelf: React.FC<Props> = ({ next, close }) => {
  return (
    <OnBoardingContainer style={{ maxWidth: '545px' }}>
      <OnBoardingTitle>Own Yourself</OnBoardingTitle>
      <p
        style={{
          fontWeight: 600,
          fontSize: '16px',
          lineHeight: '25px'
        }}
      >
        Take ownership of you with a <br /> Web3 wallet on Profile.
      </p>

      <div
        style={{
          width: 'calc(100% - 40px)',
          height: '225px',
          background:
            'radial-gradient(118.94% 95.69% at 80.26% 80.67%, #271149 0%, #04032B 100%)',
          margin: '20px'
        }}
      />

      <p style={{ color: '#718096', fontSize: '13px', lineHeight: '162.02%' }}>
        Note: Profile is <strong>READ ONLY</strong> until the Elastos Essentials
        wallet is connected to your Decentralized Identity (DID), which will
        unlock all features.
      </p>
      <ThemeButton
        style={{ width: '200px', margin: '20px auto 0' }}
        onClick={next}
        text="Create new wallet"
      />

      <TransparentButton onClick={close}>
        <p>Skip for now</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default OwnYourSelf;
