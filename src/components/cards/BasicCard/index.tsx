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



interface IProps {
  basicDTO: BasicDTO,
  updateFunc: any
}

const BasicCard: React.FC<IProps> = ({ basicDTO, updateFunc }: IProps) => {

  const [currentBasicDTO, setCurrentBasicDTO] = useState(basicDTO);

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
          <IonRow>
            <IonCol><IonCardTitle>Basic Information</IonCardTitle></IonCol>
            <IonCol>
              <SmallLightButton>Cancel</SmallLightButton>&nbsp;&nbsp;
              <SmallLightButton onClick={() => updateFunc(currentBasicDTO)}>Save</SmallLightButton></IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow class="ion-justify-content-start">
            <IonCol size="5">
              <SmallTextInput label="First name" name="first_name" value={currentBasicDTO.first_name} onChange={handleChange} />
            </IonCol>
            <IonCol size="5">
              <SmallTextInput label="Last name" name="last_name" value={currentBasicDTO.last_name} onChange={handleChange} />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="5">
              <SmallTextInput label="Email" name="email" value={currentBasicDTO.email} onChange={handleChange} />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <SmallTextInput label="DID" value={currentBasicDTO.did} onChange={handleChange} />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <SmallTextInput label="Vault URL" name="vault_url" value={currentBasicDTO.vault_url} onChange={handleChange} />
            </IonCol>
            <IonCol size="2">
              <SmallLightButton>Migrate Vault</SmallLightButton>
            </IonCol>
          </IonRow>
        </IonGrid>
        {/* {basicDTO.about} */}
      </IonCardContent>
    </IonCard>
  );
};

export default BasicCard;
