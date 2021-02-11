import React, { Component, useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import ButtonWhite from 'src/elements/buttons/ButtonWhite';
import style from './SpotlightCard.module.scss';

interface Props {
  title?: string;
  content?: string;
  component?: any;
  progressbar?: boolean;
}

const SpotlightCard: React.FC<Props> = ({
  title,
  content,
  component,
  progressbar,
}) => {
  return (
    <IonCard className={style['spotlight']}>
      <IonCardHeader>
        <IonCardTitle className={style['card-title']}>{title}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent className={style['card-content']}>
        {content}
        {component}
      </IonCardContent>
    </IonCard>
  );
};

export default SpotlightCard;
