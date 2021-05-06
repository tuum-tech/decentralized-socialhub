import React from 'react';
import styled from 'styled-components';

import { DefaultButton } from 'src/components/buttons';
import ProgressBar from 'src/components/ProgressBar';

import badgeImg from '../../../../../../assets/dashboard/tutorialbadge.png';
import style from './style.module.scss';

export const CardTitle = styled.p`
  color: white;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  margin: 0;
`;

export const CardText = styled.p`
  margin-top: 5px;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 23px;
  color: white;
  max-width: 315px;
`;

export const MainCard = styled.div`
  background-size: cover !important;

  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  min-height: 189px;
  padding: 46px 61px;
  position: relative;

  margin-bottom: 22px;
`;

export const BadgeImg = styled.img`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  height: 102px !important;
  width: 102px !important;
`;

const ButtonsArea = styled.div`
  display: flex;
  align-items: center;
  color: white;
  margin-top: 15px;
`;

const ProgressArea = styled.div`
  margin-left: 21px;
  p {
    margin-top: 8px;
    color: white;

    font-family: 'SF Pro Display';
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
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
    <MainCard className={style['begginers-card']}>
      <CardTitle>Beginners tutorial</CardTitle>
      <CardText>
        Complete the tutorial to start adding and sharing your profiles.
      </CardText>
      <ButtonsArea>
        <DefaultButton
          width="160px"
          onClick={onTutorialStart}
          color="#4C6FFF"
          bgColor="#F3F9FF"
        >
          {tutorialStep === 1 ? 'Start ' : 'Resume '}Tutorial
        </DefaultButton>
        <ProgressArea>
          <ProgressBar
            value={percent}
            containerColor="#263985"
            progressColor="#FFFFFF"
            width="120px"
          />
          <p>{tutorialStep} / 4 completed</p>
        </ProgressArea>
      </ButtonsArea>

      <BadgeImg src={badgeImg} />
    </MainCard>
  );
};

export default BeginnersTutorial;
