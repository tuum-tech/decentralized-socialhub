import React, { useState, useEffect } from 'react';
import { IonContent, IonGrid, IonSearchbar } from '@ionic/react';
import style from './style.module.scss';

const FollowingHeader: React.FC = () => {
  return (
    <>
      <IonContent className={style['connections-header']}>
        <div className={style['header-content']}>
          <h1>Connections</h1>
          <h2>Followings()</h2>
        </div>
      </IonContent>
    </>
  );
};

export default FollowingHeader;
