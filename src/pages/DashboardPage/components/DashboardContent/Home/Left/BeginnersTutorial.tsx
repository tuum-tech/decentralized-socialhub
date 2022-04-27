import React from 'react';
import styled from 'styled-components';

import ProgressBar from 'src/elements/ProgressBar';
import { DefaultButton } from 'src/elements-v2/buttons';
import MainCard from './MainCard';
import badgeImg from '../../../../../../assets/dashboard/tutorialbadge.png';
import styles from './style.module.scss';

const ButtonsArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  margin-top: 15px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-left: 20px;
  p {
    padding-left: 8px;
    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }
`;

interface Props {
  onTutorialStart: () => void;
  tutorialStep: number;
}

const BeginnersTutorial: React.FC<Props> = ({
  onTutorialStart,
  tutorialStep
}) => {
  const percent = Math.round((tutorialStep / 4) * 100);

  return (
    <MainCard
      title="Beginners tutorial"
      description="Complete the tutorial to start adding and sharing your profiles."
      right={<img src={badgeImg} alt="tutorial-img" />}
      rightFlex={0.4}
      background={styles['dark-gradient']}
      titleColor="white"
      descriptionColor="white"
    >
      <ButtonsArea>
        <DefaultButton
          variant="contained"
          btnColor="light-gradient"
          onClick={onTutorialStart}
        >
          {tutorialStep === 1 ? 'Start ' : 'Resume '}Tutorial
        </DefaultButton>
        <ProgressContainer>
          <ProgressBar
            value={percent}
            progressColor={styles['primary-gradient']}
          />
          <p className="ion-text-nowrap">{tutorialStep} / 4 completed</p>
        </ProgressContainer>
      </ButtonsArea>
    </MainCard>
  );
};

export default BeginnersTutorial;
