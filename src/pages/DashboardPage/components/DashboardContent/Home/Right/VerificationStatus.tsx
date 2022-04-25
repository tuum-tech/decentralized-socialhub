import React from 'react';
import styled from 'styled-components';

import ProgressBar from 'src/elements/ProgressBar';

export const LeftCardTitle = styled.p`
  color: black;
  font-size: 18px;
  font-weight: bold;
  line-height: normal;
  margin: 0;
`;

export const LeftCard = styled.div`
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  padding: 56px 55px;

  font-family: 'SF Pro Display';
  background-size: auto 100% !important;
  min-height: 248px;
  background: white;
  position: relative;

  margin-bottom: 22px;
`;

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
  margin-bottom: 17px;
`;

export const ExploreAll = styled.p`
  font-style: normal;
  font-weight: 700;
  font-size: 12px;
  color: var(--theme-primary-blue);
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

interface Props {
  progress: number;
}

const VerificationStatus: React.FC<Props> = ({ progress }) => {
  const percent = progress ? parseFloat(progress.toFixed(2)) : 0;
  return (
    <MainCard>
      <CardTitle>Verification status</CardTitle>

      <CardText>Includes name, email, education & experience</CardText>

      <ProgressArea>
        <ProgressBar value={percent} width="calc(100% - 90px)" />
        <p>{percent}% verified</p>
      </ProgressArea>
    </MainCard>
  );
};

export default VerificationStatus;
