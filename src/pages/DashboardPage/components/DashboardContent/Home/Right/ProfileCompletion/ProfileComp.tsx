import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { useHistory } from 'react-router';
import styled from 'styled-components';

import ProgressBar from 'src/elements/ProgressBar';
import DropButton from './DropButton';
import check from '../../../../../../../assets/icon/check-gray.svg';
import checkgreen from '../../../../../../../assets/icon/check-dark-green.svg';

import PersonIcon from 'src/assets/icon/profile-person-green.svg';
import EducationIcon from 'src/assets/icon/profile-education-green.svg';
import BagIcon from 'src/assets/icon/profile-bag-green.svg';

import PersonBlueIcon from 'src/assets/icon/profile-person-blue.svg';
import EducationBlueIcon from 'src/assets/icon/profile-education-blue.svg';
import BagBlueIcon from 'src/assets/icon/profile-bag-blue.svg';
import styles from './ProfileComp.module.scss';

const Container = styled(IonGrid)`
  margin-bottom: 10px;
  border: 1px solid rgba(229, 229, 229, 0.65);
  border-radius: 16px;
  padding: 16px 12px;

  font-family: 'Open Sans', sans-serif;
  min-width: 253px;
  font-stretch: normal;
  font-style: normal;
  --ion-grid-padding: 0;

  img {
    width: 15.2px;
  }

  ion-row {
    align-items: center;
  }
`;
const Header = styled.div`
  display: flex;
`;
const HeaderTitle = styled.div`
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  color: #7a7a9d;
  flex-grow: 1;
`;
const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
`;
const ProgressBarChart = styled.div`
  width: 42px;
`;
const ProgressBarText = styled.div`
  font-size: 14px;
  font-weight: normal;
  line-height: 1.71;
  letter-spacing: 0.13px;
  color: rgba(0, 0, 0, 0.87);
  margin: 0 10px;
`;
const ItemRow = styled(IonRow)`
  --ion-grid-column-padding: 0px;
  margin-bottom: 10px;
`;
const ItemImgColum = styled(IonCol)`
  padding-right: 7.8px;
  padding-top: 2.4px;
  height: 20px;
  img {
    display: block;
  }
`;
const ItemImgColumRound = styled(IonCol)<{ background: string }>`
  background: ${props => props.background};
  width: 26px !important;
  height: 26px;
  border-radius: 100px;
  padding: 2px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const ItemTxtColum = styled.div<{ gradient: string }>`
  font-size: 14px;
  font-weight: normal;
  line-height: 1.43;
  letter-spacing: 0.25px;
  ${props =>
    props.gradient
      ? `
    background: ${props.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    `
      : 'color : #4C6FFF;'}
`;

const ItemTxtComplete = styled.div`
  font-size: 10px;
  font-weight: normal;
  line-height: 1.43;
  letter-spacing: 0.25px;
  color: #007e84;
`;

interface IProps {
  title?: string;
  targetList: string[];
  accomplishedList: string[];
  expanded: boolean;
  expandClicked: () => void;
}

const ProfileComp: React.FC<IProps> = ({
  title,
  targetList,
  accomplishedList,
  expanded,
  expandClicked
}) => {
  const icons = {
    'Add About me Done': PersonIcon,
    'Add Experience Done': BagIcon,
    'Add Education Done': EducationIcon,
    'Add About me': PersonBlueIcon,
    'Add Experience': BagBlueIcon,
    'Add Education': EducationBlueIcon,
    'Tutorial Completed': BagBlueIcon,
    'Social Media Authenticated': BagBlueIcon,
    'Tutorial Completed Done': BagIcon,
    'Social Media Authenticated Done': BagIcon
  };

  const percent =
    accomplishedList.length === 0
      ? 0
      : Math.round((accomplishedList.length / targetList.length) * 100);

  const history = useHistory();
  const handleAddExperience = (isDone: boolean) => {
    if (!isDone) {
      history.push(`/manager/${title}`);
    }
  };

  const renderTodoLitem = (text: string) => {
    const isDone = accomplishedList.includes(text);
    return (
      <ItemRow
        key={`todoItem_${text}`}
        style={{ cursor: 'pointer' }}
        onClick={() => handleAddExperience(isDone)}
      >
        <ItemImgColumRound
          size="auto"
          background={
            isDone ? styles['linear-gradient'] : 'var(--ion-color-gray200)'
          }
        >
          {(icons as any)[text] &&
            (isDone ? (
              <img src={(icons as any)[`${text} Done`]} alt={text} />
            ) : (
              <img src={(icons as any)[text]} alt={text} />
            ))}
        </ItemImgColumRound>
        <IonCol style={{ display: 'flex', flexDirection: 'column' }}>
          <ItemTxtColum gradient={isDone ? styles['main-green-gradient'] : ''}>
            {text}
          </ItemTxtColum>
          {isDone && <ItemTxtComplete>Completed</ItemTxtComplete>}
        </IonCol>
        <ItemImgColum size="auto">
          {isDone ? (
            <img src={checkgreen} alt="check" />
          ) : (
            <img src={check} alt="task" />
          )}
        </ItemImgColum>
      </ItemRow>
    );
  };

  return (
    <Container
      style={{
        background: expanded ? 'white' : '#F5F8FA'
      }}
    >
      <Header>
        <HeaderTitle>{title}</HeaderTitle>
        <ProgressContainer>
          <ProgressBarChart>
            <ProgressBar value={percent} containerColor="#dde5ec" />
          </ProgressBarChart>
          <ProgressBarText>
            {accomplishedList.length}/{targetList.length}
          </ProgressBarText>
          <DropButton isUp={expanded} onClick={expandClicked} />
        </ProgressContainer>
      </Header>
      {expanded && (
        <div className="mt-3">
          {targetList.map((text: string) => renderTodoLitem(text))}
        </div>
      )}
    </Container>
  );
};

export default ProfileComp;
