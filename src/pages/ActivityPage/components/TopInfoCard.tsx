import React from 'react';
import styled from 'styled-components';

interface TopInfoCardContainerProps {
  bgColor?: string;
}

const TopInfoCardContainer = styled.div<TopInfoCardContainerProps>`
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  display: flex;
  align-items: center;
  padding: 28px 24px;

  .left {
    display: block;
    border-radius: 10px;
    background-color: ${props => (props.bgColor ? props.bgColor : '#1D1D1B')};
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

interface TopInfoCardProps {
  img: string;
  title: string;
  text: string;
  bgColor: string;
}

const TopInfoCard: React.FC<TopInfoCardProps> = ({
  img,
  title,
  text,
  bgColor
}) => {
  return (
    <TopInfoCardContainer bgColor={bgColor}>
      <div className="left"></div>
      <div className="right">
        <p className="title">Total Requests</p>
        <p className="text"> 1.2K</p>
      </div>
    </TopInfoCardContainer>
  );
};

export default TopInfoCard;
