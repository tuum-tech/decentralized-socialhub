import React from 'react';
import {
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonText
} from '@ionic/react';
import styled from 'styled-components';

import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import ProfileTemplateManager from '../ProfileTemplateManager';

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 1.5em;
  margin-bottom: 1.5em;

  background-color: #f7fafc;
`;

interface IProps {
  sessionItem: ISessionItem;
}

const TemplateManagerCard: React.FC<IProps> = ({ sessionItem }: IProps) => {
  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonCardTitle>Profile Template Selection</IonCardTitle>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonText>
          You can choose any template you like. The template only applies to the
          public profile as seen by others. This does not apply to your profile
          on Dashboard.
        </IonText>
        <Divider />
        {sessionItem && sessionItem.did && (
          <ProfileTemplateManager sessionItem={sessionItem} />
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default TemplateManagerCard;
