import React from 'react';

import style from './ArrowButton.module.scss';
import leftarrow from '../../assets/icon/leftarrow.svg';

interface Props {
  direction?: string;
  onClick?: () => void;
}

const ArrowButton: React.FC<Props> = ({ direction = 'left', onClick }) => {
  return (
    <div onClick={onClick} className={style['arrow-btn']}>
      {direction === 'left' && <img src={leftarrow} />}
    </div>
  );
};

export default ArrowButton;
