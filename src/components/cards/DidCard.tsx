import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonItem,
  IonList,
} from '@ionic/react';
import style from './DidCard.module.scss';
import SkeletonAvatar from '../avatars/SkeletonAvatar';

interface Props {
  name?: string;
  did?: string;
  avatar?: string;
}

const DidCard: React.FC<Props> = ({ name, did, avatar }) => {
  return (
    <IonCard className={style['did']}>
      <IonCardContent>
        <IonList>
          <IonItem className={style['badge-item']}>
            <span>
              <SkeletonAvatar />
              <img
                src={avatar}
                width='80'
                height='80'
                className={style['clip-avatar-svg']}
              />
            </span>
            {name}
            <br />
            {did}
            <span className={style['card-link']}>Follow+</span>
          </IonItem>
        </IonList>
      </IonCardContent>
    </IonCard>
  );
};

export default DidCard;
