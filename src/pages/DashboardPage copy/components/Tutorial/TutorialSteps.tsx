import React from 'react';
import style from './style.module.scss';

export interface TutorialStepsProps {
  step: number;
}

const TutorialStepsComponent: React.FC<TutorialStepsProps> = ({ step }) => {
  const getBackcircle = (step: number) => {
    if (step === 1) return 'tutorial-circle-1';
    if (step === 2) return 'tutorial-circle-2';
    if (step === 3) return 'tutorial-circle-3';

    return 'tutorial-circle-4';
  };

  return (
    <div>
      <ul className={style['timeline']}>
        <li className={style['active'] + ' ' + (step > 1 ? style['next'] : '')}>
          About <br />
          Profile
        </li>
        <li
          className={
            style[step > 1 ? 'active' : getBackcircle(step)] +
            ' ' +
            (step > 2 ? style['next'] : '')
          }
        >
          Decentralized <br />
          Identity
        </li>
        <li
          className={
            style[step > 2 ? 'active' : getBackcircle(step)] +
            ' ' +
            (step > 3 ? style['next'] : '')
          }
        >
          Decentralized <br />
          Storage
        </li>
        <li className={style[step > 3 ? 'active' : getBackcircle(step)]}>
          Complete
        </li>
      </ul>
    </div>
  );
};

export default TutorialStepsComponent;
