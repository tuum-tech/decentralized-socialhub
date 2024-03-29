import React, { useState, useEffect } from 'react';
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/react';
import ProgressBar from 'src/elements/ProgressBar';
import GradientText from 'src/elements-v2/buttons/GradientText';
import styled from 'styled-components';
import style from './OverviewCard.module.scss';

const CardTitle = styled(GradientText)`
  font-weight: 700;
  font-size: 18px;
  padding-right: 16px;
`;

const ProgressBarChart = styled.div`
  width: 100%;
  padding-right: 8px;
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  flex-grow: 1;
}
`;
const ScorePanel = styled.div`
  display: flex;
`;
const Completed = styled.div`
  color: #04032b;
  padding: 0px 25px 0px 0px;
  height: 50px;
  border-right: 1px solid #ffffff;
  & p:nth-child(1) {
    font-size: 18px;
    font-weight: bold;
  }
  & p:nth-child(2) {
    font-size: 10px;
  }
`;
const Total = styled.div`
  color: #04032b;
  padding: 0px 15px 0px 35px;
  height: 50px;
  & p:nth-child(1) {
    font-size: 18px;
    font-weight: bold;
  }
  & p:nth-child(2) {
    font-size: 10px;
  }
`;
interface Props {
  badges: IBadges;
}

const OverviewCard: React.FC<Props> = ({ badges }) => {
  const [totalBadgeCount, setTotalBadgeCount] = useState(0);
  const [completedBadgeCount, setCompletedBadgeCount] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  useEffect(() => {
    if (!badges) return;
    let _totalBadgeCount = 0;
    let _completedBadgeCount = 0;

    _totalBadgeCount += Object.keys(badges?.account).length;
    _totalBadgeCount += Object.keys(badges?.socialVerify).length;
    _totalBadgeCount += Object.keys(badges?.didPublishTimes).length;
    _totalBadgeCount += Object.keys(badges?.dStorage).length;

    _completedBadgeCount += Object.keys(badges?.account).filter(
      key => (badges?.account as any)[key].archived
    ).length;
    _completedBadgeCount += Object.keys(badges?.socialVerify).filter(
      key => (badges?.socialVerify as any)[key].archived
    ).length;
    _completedBadgeCount += Object.keys(badges?.didPublishTimes).filter(
      key => (badges?.didPublishTimes as any)[key].archived
    ).length;
    _completedBadgeCount += Object.keys(badges?.dStorage).filter(
      key => (badges?.dStorage as any)[key].archived
    ).length;
    setTotalBadgeCount(_totalBadgeCount);
    setCompletedBadgeCount(_completedBadgeCount);
    setProgressPercent(
      Math.floor((_completedBadgeCount * 100) / _totalBadgeCount)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [badges]);
  return (
    <IonCard className={style['spotlight']}>
      <IonCardHeader className={style['card-header']}>
        <CardTitle>Overview</CardTitle>
        <ProgressContainer>
          <ProgressBarChart>
            <ProgressBar
              value={progressPercent}
              height={14}
              progressColor={style['primary-gradient']}
            />
          </ProgressBarChart>
          <GradientText className="ion-text-nowrap">{`${progressPercent}% Completed`}</GradientText>
        </ProgressContainer>
      </IonCardHeader>
      <IonCardContent className={style['card-content']}>
        <GradientText gradient="main-dark-gradient">
          You gain badges, the more you complete and use your profile. Level
          your profile up! Click on a badge to learn more about it.
        </GradientText>
        <ScorePanel>
          <Completed>
            <p>{completedBadgeCount}</p>
            <p>Completed</p>
          </Completed>
          <Total>
            <p>{totalBadgeCount}</p>
            <p>Total</p>
          </Total>
        </ScorePanel>
      </IonCardContent>
    </IonCard>
  );
};

export default OverviewCard;
