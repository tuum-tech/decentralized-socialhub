import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
} from '@ionic/react';
import style from './OverviewCard.module.scss';
import styleWidget from '../cards/WidgetCards.module.scss';
import { BasicDTO } from 'src/pages/PublicPage/types';

interface BasicInfo {
  adress: string,
  name: string

}

interface IProps {
  basicDTO: BasicDTO
}

const AboutCard: React.FC<IProps> = ({ basicDTO }: IProps) => {
  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
        <IonCardTitle>About</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {basicDTO.about}
      </IonCardContent>
    </IonCard>
  );
};

export default AboutCard;
