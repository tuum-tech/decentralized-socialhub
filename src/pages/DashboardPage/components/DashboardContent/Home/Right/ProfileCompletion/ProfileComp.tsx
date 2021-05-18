import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';

import check from '../../../../../../../theme/images/checkmark-circle-outline.svg';
import checkgreen from '../../../../../../../assets/icon/check-circle-fill.svg';
import ProgressBar from 'src/components/ProgressBar';
import DropButton from './DropButton';

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
const ItemTxtColum = styled(IonCol)`
  font-size: 14px;
  font-weight: normal;
  line-height: 1.43;
  letter-spacing: 0.25px;
  color: ${props => (props.color ? props.color : 'rgba(0, 0, 0, 0.6)')};
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
  const percent =
    accomplishedList.length === 0
      ? 0
      : Math.round((accomplishedList.length / targetList.length) * 100);

  const renderTodoLitem = (text: string) => {
    const isDone = accomplishedList.includes(text);
    return (
      <ItemRow key={`todoItem_${text}`}>
        <ItemImgColum size="auto">
          {isDone ? (
            <img src={checkgreen} alt="check" />
          ) : (
            <img src={check} alt="task" />
          )}
        </ItemImgColum>
        <ItemTxtColum color={isDone ? '#00b715' : 'rgba(0, 0, 0, 0.6)'}>
          {text}
        </ItemTxtColum>
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
