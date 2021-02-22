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
import { ExperienceItem, ExperienceDTO } from 'src/pages/PublicPage/types';
import styled from 'styled-components';



interface IProps {
  experiences: ExperienceDTO
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

const experienceItem = (experienceItem: ExperienceItem) => {
  return (
    <IonGrid>
      <IonRow>

        <IonCol size="2">
          image
      </IonCol>
        <IonCol size="9">
          <IonGrid>
            <IonRow><Institution>{experienceItem.entity.name}</Institution></IonRow>
            <IonRow><Program>{experienceItem.title}</Program></IonRow>
            <IonRow><Period>{experienceItem.period.start} until {experienceItem.period.end}</Period></IonRow>
            <IonRow><Description>{experienceItem.description}</Description></IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

const ExperienceCard: React.FC<IProps> = ({ experiences }: IProps) => {
  const listExperiences = experiences.items.map(x => experienceItem(x))

  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        <IonCardTitle>Experience</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {
          listExperiences
        }
      </IonCardContent>
    </IonCard>
  );
};

export default ExperienceCard;
