import React from 'react';
import style from './style.module.scss';

interface IProps {
  value?: number,
}

const TodoList: React.FC<IProps> = ({ value }) => {
  const percent = value ? value : 0;
  return (
    <div className={style["Progressbar"]}>
      <div className={style["Progressbar_value"]} style={{ width: `${percent}%`}} ></div>
      <progress value={percent} max="100">{percent}%</progress>
    </div>
  )
};

export default TodoList;
