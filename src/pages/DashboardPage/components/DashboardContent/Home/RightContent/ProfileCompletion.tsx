import React from 'react';
import styled from 'styled-components';

import ProgressBar from 'src/components/ProgressBar';
import DropDown from 'src/components/arrows/DropDown';
import {
  MainCard,
  CardTitle,
  CardText,
  ProgressArea
} from './VerificationStatus';

const ProfileStep = styled.div`
  background: #f5f8fa;
  border-radius: 16px;
  padding: 16px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 17px;

  margin-bottom: 11px;

  .title {
    color: #7a7a9d;
  }
`;

const ProgressAreaContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    margin-right: 15px;
  }
`;

const ProfileCompletion: React.FC = ({}) => {
  const renderContent = () => {
    const data = [
      {
        title: 'Basic Information',
        value: 3,
        targets: 5
      },
      {
        title: 'Education',
        value: 3,
        targets: 5
      },
      {
        title: 'Experience',
        value: 3,
        targets: 5
      },
      {
        title: 'Others',
        value: 3,
        targets: 5
      }
    ];
    const renderComponents = [];
    for (let i = 0; i < data.length; i++) {
      const percent = Math.round((data[i].value / data[i].targets) * 100);

      renderComponents.push(
        <ProfileStep key={i}>
          <p className="title">{data[i].title}</p>
          <ProgressAreaContainer>
            <ProgressArea>
              <ProgressBar value={percent} width="42px" />
              <p>
                {data[i].value} / {data[i].targets}
              </p>
            </ProgressArea>
            <DropDown />
          </ProgressAreaContainer>
        </ProfileStep>
      );
    }
    return renderComponents;
  };
  const percent = 10;
  return (
    <MainCard>
      <CardTitle>Profile Completion</CardTitle>
      <CardText>Complete tasks and gain badges.</CardText>

      <ProgressArea style={{ marginTop: '13px', marginBottom: '20px' }}>
        <ProgressBar value={percent} width="calc(100% - 90px)" />
        <p>{percent}% Verified</p>
      </ProgressArea>

      {renderContent()}
    </MainCard>
  );
};

export default ProfileCompletion;
