import React from 'react';
import { IonCard } from '@ionic/react';
import styled from 'styled-components';

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

export const MainCard = styled(IonCard)`
  background-size: cover !important;

  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  min-height: 189px;
  padding: 46px 61px;
  position: relative;
`;

export const BadgeImg = styled.img`
  position: absolute;
  right: 80px;
  top: 50%;
  transform: translateY(-50%);
  height: 102px !important;
  width: 102px !important;
`;

const BeginnersTutorial: React.FC = ({}) => {
  return (
    <MainCard className={style['begginers-card']}>
      <CardTitle>Beginners tutorial</CardTitle>
      <CardText>
        Complete the tutorial to start adding and sharing your profiles.
      </CardText>

      <BadgeImg src={badgeImg} />
    </MainCard>
  );
};

export default BeginnersTutorial;
