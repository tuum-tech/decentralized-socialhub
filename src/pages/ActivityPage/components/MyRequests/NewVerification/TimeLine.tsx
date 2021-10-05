import React from 'react';

import style from './style.module.scss';

interface Props {
  step: number;
}

const TimeLine: React.FC<Props> = ({ step }: Props) => {
  return (
    <div className={style['timeline']}>
      <div className={style['step']}>
        <div className={style['dot']}>
          <div className={style['empty']}>
            <div className={style['active']} />
          </div>
        </div>
        <p style={{ marginLeft: '-20px' }}>
          Choose
          <br /> Credentials
        </p>
      </div>

      <div className={style['step']}>
        <div className={style['dot']}>
          <div className={style['empty']}>
            {step > 1 && <div className={style['active']} />}
          </div>
        </div>
        <p style={{ marginLeft: '-15px' }}>
          Choose
          <br /> Verifiers
        </p>
      </div>

      <div className={style['step']}>
        <div className={style['dot']}>
          <div className={style['empty']}>
            {step > 2 && <div className={style['active']} />}
          </div>
        </div>
        <p style={{ marginLeft: '-13px' }}>
          Review
          <br /> Request
        </p>
      </div>
    </div>
  );
};

export default TimeLine;
