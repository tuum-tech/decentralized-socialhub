import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';

import style from './style.module.scss';

interface IProps {
  scrollToPosition: any;
}

const Navigation = styled.div`
  position: sticky;
  top: 284px;
`;

const PublicProfileTabs: React.FC<IProps> = ({ scrollToPosition }: IProps) => {
  const [active, setActive] = useState('about');

  return (
    <Navigation className={style['sticky']}>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active === 'about' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => {
            setActive('about');
            scrollToPosition('about');
          }}
        >
          <IonLabel className={style['tab-label']}>About</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'experience' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => {
            setActive('experience');
            scrollToPosition('experience');
          }}
        >
          <IonLabel className={style['tab-label']}>Experience</IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'education' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => {
            setActive('education');
            scrollToPosition('education');
          }}
        >
          <IonLabel className={style['tab-label']}>Education</IonLabel>
        </IonItem>
      </IonList>
    </Navigation>
  );
};

export default PublicProfileTabs;
