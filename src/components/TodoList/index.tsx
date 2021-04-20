import React, { useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';

import check from '../../theme/images/checkmark-circle-outline.svg';
import checkgreen from '../../assets/check-circle-fill.svg';
import ProgressBar from '../ProgressBar';
import style from './style.module.scss';

const ProgressBarRow = styled(IonRow)`
  margin-bottom: 21px;
`;

const ProgressBarChart = styled(IonCol)`
  --ion-grid-column-padding: 0px;
  width: 62%;
  max-width: 62%;
  padding-right: 11px !important;
`;

const ProgressBarText = styled(IonCol)`
  --ion-grid-column-padding: 0px;
  width: 38%;
  max-width: 38%;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.71;
  letter-spacing: 0.13px;
  color: rgba(0, 0, 0, 0.87);
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
}

const TodoList: React.FC<IProps> = ({
  title,
  targetList,
  accomplishedList
}) => {
  const [showMore, setShowMore] = useState(false);

  if (!targetList || targetList.length === 0) {
    return (
      <div className={style['todolist']}>
        <p className={style['todolist_title']}>No Todo List</p>
      </div>
    );
  }

  const percent =
    accomplishedList.length === 0
      ? 0
      : Math.round((accomplishedList.length / targetList.length) * 100);
  let firstFiveTodos = [];
  let CollapsedTodos: string[] = [];
  if (targetList.length > 0) {
    firstFiveTodos = targetList.slice(0, 5);
    CollapsedTodos = targetList.slice(5, targetList.length);
  } else {
    firstFiveTodos = targetList;
  }

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
    <div className={style['todolist']}>
      {title && title !== '' && (
        <p className={style['todolist_title']}>{title}</p>
      )}
      <IonGrid>
        <ProgressBarRow>
          <ProgressBarChart>
            {' '}
            <ProgressBar value={percent} />{' '}
          </ProgressBarChart>
          <ProgressBarText> {`${percent}% complete`} </ProgressBarText>
        </ProgressBarRow>
        {firstFiveTodos.map((text: string) => renderTodoLitem(text))}
        {showMore &&
          CollapsedTodos.length > 0 &&
          CollapsedTodos.map((text: string) => renderTodoLitem(text))}
      </IonGrid>
      {/* {targetList.length > 3 && (
        <button
          onClick={() => setShowMore(!showMore)}
          className={style['btn-expand']}
        >
          {showMore ? 'Collapse' : 'Expand All'}
        </button>
      )} */}
    </div>
  );
};

export default TodoList;
