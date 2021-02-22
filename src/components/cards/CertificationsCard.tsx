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

export interface Certification {
  isEnabled: boolean,
  entity: string,
  period: string,
  title: string,
  description: string,
  order: string
}


export interface Certifications {
  isEnabled: boolean,
  items: Certification[]
}

interface IProps {
  certifications: Certifications
}


const certificationItem = (certificationItem: Certification) => {
  return (
    <IonGrid>
      <IonRow>

        <IonCol size="2">
          image
      </IonCol>
        <IonCol size="9">
          <IonGrid>
            <IonRow>{certificationItem.title}</IonRow>
            <IonRow>{certificationItem.entity}</IonRow>
            <IonRow>{certificationItem.period}</IonRow>
            <IonRow>{certificationItem.description}</IonRow>
          </IonGrid>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
}

const CertificationsCard: React.FC<IProps> = ({ certifications }: IProps) => {
  const listCertifications = certifications.items.map(x => certificationItem(x))

  return (
    <IonCard className={style['overview']}>
      <IonCardHeader>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
        <IonCardTitle>Certifications</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        {
          listCertifications
        }
        {
          //JSON.stringify(experiences)
        }
      </IonCardContent>
    </IonCard>
  );
};

export default CertificationsCard;
