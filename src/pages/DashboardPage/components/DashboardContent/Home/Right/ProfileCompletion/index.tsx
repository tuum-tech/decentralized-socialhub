import React, { useState } from 'react';
import styled from 'styled-components';

import ProgressBar from 'src/components/ProgressBar';
import DropDown from 'src/components/arrows/DropDown';
import {
  MainCard,
  CardTitle,
  CardText,
  ProgressArea
} from '../VerificationStatus';
import ProfileComp from './ProfileComp';

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
  const [category, setCategory] = useState(-1);
  const renderContent = () => {
    const data = [
      {
        title: 'Beginners Tutorial',
        targetList: ['Tutorial'],
        accomplishedList: ['Tutorial']
      },
      {
        title: 'Basic Information',
        targetList: ['Add About me', 'Add Experience', 'Add Education'],
        accomplishedList: ['Add About me']
      },
      {
        title: 'Education',
        targetList: ['Education'],
        accomplishedList: ['Education']
      },
      {
        title: 'Experience',
        targetList: ['Experience'],
        accomplishedList: ['Experience']
      },
      {
        title: 'Others',
        targetList: ['Other1', 'Other2', 'Other3'],
        accomplishedList: ['Other1']
      }
    ];
    const renderComponents = [];
    for (let i = 0; i < data.length; i++) {
      renderComponents.push(
        <ProfileComp
          key={i}
          title={data[i].title}
          targetList={data[i].targetList}
          accomplishedList={data[i].accomplishedList}
          expanded={category === i}
          expandClicked={() => {
            if (category === i) {
              setCategory(-1);
            } else {
              setCategory(i);
            }
          }}
        />
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

      {/* <ProfileComp
        title="Basic Information"
        targetList={['Add About me', 'Add Experience', 'Add Education']}
        accomplishedList={['Add About me']}
      /> */}
      {renderContent()}
    </MainCard>
  );
};

export default ProfileCompletion;
