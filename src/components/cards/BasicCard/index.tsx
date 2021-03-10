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

const MigrateButton = styled(SmallLightButton)`
margin-top:40px;
`;


interface IProps {
  sessionItem: ISessionItem,
  updateFunc: any
}

const BasicCard: React.FC<IProps> = ({ sessionItem, updateFunc }: IProps) => {

  const [currentBasicDTO, setCurrentBasicDTO] = useState(sessionItem);

  const handleChange = (evt: any) => {

    const value =
      evt.target.type === "checkbox" ? evt.target.checked : evt.target.value;
    setCurrentBasicDTO({
      ...currentBasicDTO,
      [evt.target.name]: value
    });


  }



  return (

    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        {/* <IonCardSubtitle>Card Subtitle</IonCardSubtitle> */}
        <IonGrid>
          <IonRow class="ion-justify-content-between">
            <IonCol><IonCardTitle>Basic Information</IonCardTitle></IonCol>
            <IonCol size="auto">
              <SmallLightButton disabled={sessionItem.onBoardingCompleted === false} onClick={() => updateFunc(currentBasicDTO)}>Save</SmallLightButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow class="ion-justify-content-start">
            <IonCol size="5">
              <SmallTextInput disabled={!sessionItem.tutorialCompleted} label="First name" name="firstName" value={currentBasicDTO.firstName} onChange={handleChange} />
            </IonCol>
            <IonCol size="5">
              <SmallTextInput disabled={!sessionItem.tutorialCompleted} label="Last name" name="lastName" value={currentBasicDTO.lastName} onChange={handleChange} />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="5">
              <SmallTextInput disabled={true} label="Email" name="email" value={currentBasicDTO.email} onChange={handleChange} />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <SmallTextInput disabled={true} label="DID" value={currentBasicDTO.did} onChange={handleChange} />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <SmallTextInput disabled={true} label="Vault URL" value={currentBasicDTO.hiveHost} onChange={handleChange} />
            </IonCol>
            <IonCol size="auto">

              <MigrateButton>Migrate Vault</MigrateButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* {basicDTO.about} */}
      </IonCardContent>
    </IonCard >
  );
};

export default BasicCard;
