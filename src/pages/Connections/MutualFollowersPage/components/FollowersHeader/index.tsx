import React from 'react';
import { IonContent } from '@ionic/react';
import style from './style.module.scss';

interface Props {
  followersCount?: number;
}

const FollowingHeader: React.FC<Props> = ({ followersCount = 0 }) => {
  return (
    <>
      <IonContent className={style['connections-header']}>
        <div className={style['header-content']}>
          <h1>Connections</h1>
          <h2>Mutual Followers({followersCount})</h2>
        </div>
      </IonContent>
    </>
  );
};

export default FollowingHeader;
