import React from 'react';
import check from 'src/assets/check-circle-fill.svg';
import uncheck from 'src/assets/check-circle.svg';

export interface CheckProps {
  text: string;
  isChecked: boolean;
}

const Check: React.FC<CheckProps> = ({ text = '', isChecked = false }) => {
  return (
    <div>
      {isChecked ? (
        <img alt="check" src={check} />
      ) : (
        <img alt="check" src={uncheck} />
      )}
      <span>&nbsp;{text}</span>
    </div>
  );
};

export default Check;
