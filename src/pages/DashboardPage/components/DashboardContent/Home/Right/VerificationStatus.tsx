import React from 'react';
import styled from 'styled-components';

import ProgressBar from 'src/components/ProgressBar';
import {
  MainCard as LeftCard,
  CardTitle as LeftCardTitle
} from '../Left/ManageProfile';

export const ProgressArea = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    margin-left: 13px;
    color: rgba(39, 39, 46, 0.56);

    font-family: SF Pro Display;
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 16px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const MainCard = styled(LeftCard)`
  padding: 21px !important;
  min-height: 100px;

  margin-bottom: 22px;
`;

export const CardTitle = styled(LeftCardTitle)`
  margin-bottom: 25px;
`;

export const ExploreAll = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: #4c6fff;
  cursor: pointer;
`;

export const CardText = styled.p`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 23px;
  color: #425466;
  max-width: 315px;
`;

const VerificationStatus: React.FC = ({}) => {
  const percent = 10;
  return (
    <MainCard>
      <CardTitle>Verification status[UNDER CONSTRUCTION]</CardTitle>

      <ProgressArea>
        <ProgressBar value={percent} width="calc(100% - 90px)" />
        <p>{percent}% Verified</p>
      </ProgressArea>
    </MainCard>
  );
};

export default VerificationStatus;
