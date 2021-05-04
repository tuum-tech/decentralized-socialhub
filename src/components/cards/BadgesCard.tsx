import React from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList
} from '@ionic/react';
import styled from 'styled-components';
import style from './BadgesCard.module.scss';
import ProgressBar from 'src/components/ProgressBar';

const ProgressBarChart = styled.div`
  width: calc(100% - 60px);
`;
const ProgressBarText = styled.div`
  font-size: 10px;
  font-weight: normal;
  line-height: 1.71;
  letter-spacing: 0.13px;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 10px;
`;
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;

interface Props {
  title?: string;
  progressbar?: boolean;
}

const BadgesCard: React.FC<Props> = ({ title, progressbar }) => {
  return (
    <IonCard className={style['badges']}>
      <IonCardHeader>
        <IonCardTitle className={style['card-title']}>Recent</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        Complete tasks and gain badges.
        <ProgressContainer>
          <ProgressBarChart>
            <ProgressBar value={20} containerColor="#dde5ec" />
          </ProgressBarChart>
          <ProgressBarText>20% Completed</ProgressBarText>
        </ProgressContainer>
        <IonList>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            LinkedIn Verification
            <span className={style['card-link']}>Start</span>
          </IonItem>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            Twitter Verification
            <span className={style['card-link']}>Start</span>
          </IonItem>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            Beginners Tutorial
            <span className={style['card-link']}>Start</span>
          </IonItem>
          <IonItem className={style['badge-item']}>
            <span className={style['badge-bg']}></span>
            Add Basic<span className={style['card-link']}>Start</span>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default BadgesCard;
