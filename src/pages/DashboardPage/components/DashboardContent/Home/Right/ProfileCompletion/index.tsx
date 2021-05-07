import React, { useState } from 'react';

import ProgressBar from 'src/components/ProgressBar';
import {
  MainCard,
  CardTitle,
  CardText,
  ProgressArea
} from '../VerificationStatus';
import ProfileComp from './ProfileComp';

interface Props {
  progress: number;
  completionStats: any;
}

const ProfileCompletion: React.FC<Props> = ({ progress, completionStats }) => {
  const [category, setCategory] = useState(-1);
  const renderContent = () => {
    /*
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
        accomplishedList: []
      }
    ];
    */
    const renderComponents = [];
    for (let i = 0; i < completionStats.length; i++) {
      renderComponents.push(
        <ProfileComp
          key={i}
          title={completionStats[i].title}
          targetList={completionStats[i].targetList}
          accomplishedList={completionStats[i].accomplishedList}
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
  const percent = progress ? parseFloat(progress.toFixed(2)) : 0;
  return (
    <MainCard>
      <CardTitle>Profile Completion</CardTitle>
      <CardText>Complete tasks and gain badges.</CardText>
      <ProgressArea style={{ marginTop: '13px', marginBottom: '20px' }}>
        <ProgressBar value={percent} width="calc(100% - 90px)" />
        <p>{percent}% completed</p>
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
