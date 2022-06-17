import { IonCol } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';

const StyledCol = styled(IonCol)`
  cursor: pointer;
  &:hover {
    div {
      background: #f3f3f3;
    }
  }
`;

export const ClickableCol = (props: any) => (
  <StyledCol sizeXs="12" sizeSm="auto" {...props} />
);

interface TopInfoCardProps {
  img: string;
  title: string;
  count: number;
  bgColor?: string;
}

const TopInfoCardContainer = styled.div`
  background: #edf2f7;
  border-radius: 16px;
  width: 100%;
  display: flex;
  padding: 28px 24px;

  .left {
    display: block;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    width: 38px;
    height: 38px;
  }

  .right {
    padding-left: 13px;
    .title {
      font-weight: bold;
      font-size: 18px;
      line-height: 21px;
      color: #27272e;
    }
    .text {
      font-weight: 600;
      font-size: 28px;
      line-height: 136.02%;
      color: #27272e;
      margin-bottom: 0;
    }
  }
`;

export const TopInfoCard: React.FC<TopInfoCardProps> = ({
  img,
  title,
  count,
  bgColor
}) => (
  <TopInfoCardContainer>
    <div
      className="left"
      style={{
        background: bgColor || '#1D1D1B'
      }}
    >
      <img src={img} alt="info" />
    </div>
    <div className="right">
      <p className="title">{title}</p>
      <p className="text"> {count}</p>
    </div>
  </TopInfoCardContainer>
);
