import React from 'react';
import styled from 'styled-components';
import { IonProgressBar } from '@ionic/react';

import thumbUp from 'src/assets/onboarding/onboard-thumbup.png';

export const OnBoardingContainer = styled.div`
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
  justify-content: space-between;

  padding: 40px 20px;
  width: 90%;
  margin-left: auto;
  margin-right: auto;
`;

export const OnBoardingTitle = styled.p`
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  line-height: 136.02%;

  background: linear-gradient(90deg, #995aff 0%, #dc59bf 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;

  margin-bottom: 15px;
`;

export const ProgressBar = styled(IonProgressBar)`
  height: 12px;
  border-radius: 6px;

  width: 200px;
  margin: 40px auto;

  --background: #f0e0ff;
  --progress-background: #9f30fe;
`;

interface Props {
  title?: string;
  hasImage?: boolean;
}

const LoadingModal: React.FC<Props> = ({
  title = 'Welcome to Profile',
  hasImage = true
}) => {
  return (
    <OnBoardingContainer style={{ maxWidth: '415px' }}>
      {hasImage && <img src={thumbUp} alt="thumbup" />}
      <OnBoardingTitle>{title}</OnBoardingTitle>
      <p style={{ fontSize: '14px', lineHeight: '160%' }}>
        Your Personal Decentralized Web3 Identity
      </p>

      <ProgressBar type="indeterminate" />

      <p style={{ fontSize: '14px', lineHeight: '160%' }}>
        Please wait... we're setting up your profile now.
      </p>
    </OnBoardingContainer>
  );
};

export default LoadingModal;
