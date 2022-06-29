import React from 'react';
import styled from 'styled-components';

import { ThemeButton } from 'src/elements/buttons';
import { OnBoardingTitle, OnBoardingContainer } from './LoadingModal';
import { TransparentButton } from './OwnYourSelf';
import TutorialSteps from './TutorialSteps';
import {
  RowContainer,
  TransparentWithBorderlineButton
} from './DownloadEssentials';
import badgeImg from 'src/assets/onboarding/badges.png';
import customizeImg from 'src/assets/onboarding/1.png';
import explorerImg from 'src/assets/onboarding/2.png';
import connectImg from 'src/assets/onboarding/3.png';

const Intro = styled.div`
  text-align: center;
  width: 395px;
  margin: 0 auto;

  p {
    font-weight: 600;
    font-size: 20px;
    line-height: 136.52%;

    background: radial-gradient(
      118.94% 95.69% at 80.26% 80.67%,
      #271149 0%,
      #04032b 100%
    );

    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Container = styled.div`
  font-size: 13px;
  line-height: 162.02%;
  font-feature-settings: 'salt' on;

  color: #1a202c;
  text-align: left;
  width: 320px;
  margin: 17px auto 0;

  p {
    margin: 0;
  }

  div {
    display: flex;
    align-items: center;
    margin-top: 9px;
    text-align: left;

    img {
      margin-right: 9px;
      width: 28px;
    }
  }
`;
interface Props {
  seeMyBades: () => void;
  close: () => void;
  share: () => void;
}

const AllIsSet: React.FC<Props> = ({ seeMyBades, close, share }) => {
  return (
    <OnBoardingContainer style={{ maxWidth: '565px' }}>
      <TutorialSteps step={5} />
      <OnBoardingTitle>You're all set!</OnBoardingTitle>

      <Intro>
        <img src={badgeImg} alt="badgeImg" />
        <p>
          Congratulations on activating your Profile and earning your first
          Badge!
        </p>
      </Intro>

      <Container>
        <div>You can now access all that Profile has to offer, including:</div>
        <div>
          <img src={customizeImg} alt="customizeImg" />
          <p>Customize and share your verified Web3 Profile</p>
        </div>
        <div>
          <img src={explorerImg} alt="explorerImg" />
          <p>Explore and join Web3 communities</p>
        </div>
        <div>
          <img src={connectImg} alt="connectImg" />
          <p>Connect with authentic users via encrypted chat</p>
        </div>
        <p style={{ marginLeft: '37px' }}>& much more...</p>
      </Container>

      <RowContainer style={{ maxWidth: '380px' }}>
        <TransparentWithBorderlineButton
          style={{ width: '170px' }}
          onClick={seeMyBades}
        >
          <p>See My Badges</p>
        </TransparentWithBorderlineButton>
        <ThemeButton
          style={{ width: '170px', fontSize: '16px' }}
          onClick={share}
          text="Share"
        />
      </RowContainer>
      <TransparentButton onClick={close}>
        <p>Close</p>
      </TransparentButton>
    </OnBoardingContainer>
  );
};

export default AllIsSet;
