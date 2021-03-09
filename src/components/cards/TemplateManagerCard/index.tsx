import React, { useEffect, useState } from 'react';
import { IonCardTitle, IonCardHeader, IonCard, IonCardContent, IonGrid, IonRow, IonCol, IonText, IonInput, IonButton } from '@ionic/react';
import { BasicDTO } from 'src/pages/PublicPage/types';
import styleWidget from '../../cards/WidgetCards.module.scss';
import styleInputs from '../..//WidgetCards.module.scss';
import LabeledInput from 'src/components/formComponents/LabeledInput';
import SmallTextInput from 'src/components/inputs/SmallTextInput';
import ButtonDefault from 'src/components/ButtonDefault';
import ButtonDisabled from 'src/components/ButtonDisabled';
import { ButtonLink, ButtonWithLogo } from 'src/components/buttons';
import styled from 'styled-components';
import ProfileTemplateManager from 'src/components/ProfileTemplateManager';
import { ISessionItem } from 'src/services/user.service';





const SmallLightButton = styled.button`
height: 27px;
display: inline;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;
padding: 7px 13px;
border-radius: 6px;
background-color: #f3f9ff;
font-family: 'SF Pro Display';
font-size: 14px;
font-weight: 600;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: left;
color: #4c6fff;

`;

const SmallBlueButton = styled(ButtonLink)`
height: 27px;
display: inline;
flex-direction: column;
justify-content: center;
align-items: center;
gap: 10px;
padding: 7px 13px;
border-radius: 6px;
background-color: #f3f9ff;
font-family: 'SF Pro Display';
font-size: 14px;
font-weight: 600;
font-stretch: normal;
font-style: normal;
line-height: 1;
letter-spacing: normal;
text-align: left;
color: #4c6fff;
`;

const Divider = styled.hr`
width: 100%;
height: 1px;
text-align: center;
margin-top: 1.5em;
margin-bottom: 1.5em;

background-color: #f7fafc;;
`;



interface IProps {
  sessionItem: ISessionItem
}

const TemplateManagerCard: React.FC<IProps> = ({ sessionItem }: IProps) => {

  return (

    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow>
            <IonCol><IonCardTitle>Profile Template Selection</IonCardTitle></IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonText>You have 2 profile templates you can choose from. Switching will change your public profile.</IonText>
        <Divider />
        <ProfileTemplateManager sessionItem={sessionItem} />
      </IonCardContent>
    </IonCard>
  );
};

export default TemplateManagerCard;
