import React from 'react';
import { IonContent } from '@ionic/react';

import style from './style.module.scss';

const IdentityProgressComponent: React.FC<{ stage: string }> = ({ stage }) => {
  return (
    <IonContent className={style['identityprogresscomponent']}>
      <div className={style['header']}>
        <div className={style['header-container']}>
          <span
            className={
              stage === 'create'
                ? style['header-item'] + ' ' + style['active']
                : style['header-item']
            }
          >
            <b>•</b>&nbsp;Create
          </span>
          <span
            className={
              stage === 'confirm'
                ? style['header-item'] + ' ' + style['active']
                : style['header-item']
            }
          >
            <b>•</b>&nbsp;Confirm
          </span>
          <span
            className={
              stage === 'publish'
                ? style['header-item'] + ' ' + style['active']
                : style['header-item']
            }
          >
            <b>•</b>&nbsp;Publish
          </span>
        </div>
      </div>
    </IonContent>
  );
};

export default IdentityProgressComponent;
