import React from 'react';

import LeftArrow from '../arrows/LeftArrow';
import RightArrow from '../arrows/RightArrow';
import SmallLeftArrow from '../arrows/SmallLeftArrow';
import SmallRightArrow from '../arrows/SmallRightArrow';
import style from './ArrowButton.module.scss';

interface Props {
  direction?: string;
  type?: string;
  onClick?: () => void;
  disabled?: boolean;
  size?: number;
}

const ArrowButton: React.FC<Props> = ({
  direction = 'left',
  onClick,
  type = 'transparent',
  disabled = false,
  size = 26
}) => {
  let cName = style['arrow-btn'];
  let arrowColor = 'white';

  if (type === 'whitebtn') {
    cName = cName + ' ' + style['bg-white'];
    arrowColor = 'black';
  }
  if (disabled) {
    cName = cName + ' ' + style['disabled'];
    arrowColor = '#4c6fff';
  }

  const renderLeftArrow = (arrowColor: string) => {
    if (size === 26) {
      return <SmallLeftArrow fill={arrowColor} />;
    }
    return <LeftArrow fill={arrowColor} />;
  };
  const renderRightArrow = (arrowColor: string) => {
    if (size === 26) {
      return <SmallRightArrow fill={arrowColor} />;
    }
    return <RightArrow fill={arrowColor} />;
  };

  return (
    <div
      style={{ width: size, height: size }}
      onClick={() => {
        if (onClick && !disabled) onClick();
      }}
      className={cName}
    >
      {direction === 'left' && renderLeftArrow(arrowColor)}
      {direction === 'right' && renderRightArrow(arrowColor)}
    </div>
  );
};

export default ArrowButton;
