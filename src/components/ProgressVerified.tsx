import React from 'react';
import ProgressBar from 'src/elements/ProgressBar';

type Props = {
  percent: number;
};

const ProgressVerified = ({ percent }: Props) => (
  <div
    style={{
      width: '10em',
      float: 'right',
      fontSize: '0.8em',
      display: 'flex',
      alignItems: 'center'
    }}
  >
    <ProgressBar value={percent} text={'verified'} />
    <p
      style={{
        float: 'right',
        fontSize: '0.8em',
        paddingLeft: 5,
        color: '#A0AEC0'
      }}
      className="ion-text-nowrap"
    >{`${percent}% ${'verified'}`}</p>
  </div>
);

export default ProgressVerified;
