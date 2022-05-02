import React from 'react';
import { IonContent } from '@ionic/react';
import style from './style.module.scss';

interface Props {
  followingCount?: number;
}

const FollowingHeader: React.FC<Props> = ({ followingCount = 0 }) => {
  return (
    <>
      <IonContent className={style['connections-header']}>
        <div className={style['header-content']}>
          <h1>Connections</h1>
          <h2>Following({followingCount})</h2>
        </div>
      </IonContent>
    </>
  );
};

export default FollowingHeader;
