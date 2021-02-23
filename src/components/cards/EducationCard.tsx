import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
} from '@ionic/react';
import style from './OverviewCard.module.scss';
import { EducationDTO, EducationItem } from 'src/pages/PublicPage/types';
import styled from 'styled-components';



interface IEducationProps {
  educationDTO: EducationDTO;
}

const Institution = styled.span`
  font-family: 'SF Pro Display';
  font-size: 16px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.56;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;


const Program = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.79;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;


const Period = styled.span`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.71;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;


const Description = styled.span`
  font-family: 'SF Pro Display';
  font - size: 13px;
  font - weight: normal;
  font - stretch: normal;
  font - style: normal;
  line - height: 1.62;
  letter - spacing: normal;
  text - align: left;
  color: rgba(66, 84, 102, 0.57);
`;

const educationItem = (educationItem: EducationItem) => {
  return (
    <IonGrid>
      <IonRow>
        <IonCol size="2">
          image
      </IonCol>
        <IonCol size="9">
          <IonGrid>
            <IonRow><Institution>{educationItem.institution}</Institution></IonRow>
            <IonRow><Program>{educationItem.title}</Program></IonRow>
            <IonRow><Period>{educationItem.period.start} - {educationItem.period.end}</Period></IonRow>
            <IonRow><Description>{educationItem.description}</Description></IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

const EducationCard: React.FC<IEducationProps> = ({ educationDTO }: IEducationProps) => {
  const listExperiences = educationDTO.items.map(x => educationItem(x))

  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
        <IonCardTitle id="education">Education</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {
          listExperiences
        }
      </IonCardContent>
    </IonCard>
  );
};

export default EducationCard;
