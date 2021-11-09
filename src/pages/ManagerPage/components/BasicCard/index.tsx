import React, { useState } from 'react';
import {
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';

import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import { SmallLightButton } from 'src/elements/buttons';
import EmailComp from './EmailComp';
import PhoneComp from './PhoneComp';

interface IProps {
  sessionItem: ISessionItem;
  updateFunc: any;
}

const BasicCard: React.FC<IProps> = ({ sessionItem, updateFunc }: IProps) => {
  const [currentBasicDTO, setCurrentBasicDTO] = useState(sessionItem);
  const handleChange = (evt: any) => {
    const value =
      evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;

    setCurrentBasicDTO({
      ...currentBasicDTO,
      [evt.target.name]: value
    });
  };

  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow class="ion-justify-content-between">
            <IonCol>
              <IonCardTitle>Basic Information</IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <SmallLightButton
                disabled={sessionItem.tutorialStep !== 4}
                onClick={() => updateFunc(currentBasicDTO)}
              >
                Save
              </SmallLightButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow class="ion-justify-content-start">
            <IonCol size="5">
              <SmallTextInput
                disabled={sessionItem.tutorialStep !== 4}
                label="Name"
                name="name"
                value={currentBasicDTO.name}
                onChange={handleChange}
              />
            </IonCol>
          </IonRow>

          <EmailComp
            sessionItem={sessionItem}
            emailUpdated={(newEmail: string) => {
              setCurrentBasicDTO({
                ...currentBasicDTO,
                loginCred: { ...currentBasicDTO.loginCred, email: newEmail }
              });
            }}
          />
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <SmallTextInput
                disabled={true}
                label="DID"
                value={currentBasicDTO.did}
                onChange={handleChange}
              />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <SmallTextInput
                disabled={true}
                label="Vault URL"
                value={currentBasicDTO.hiveHost}
                onChange={handleChange}
              />
            </IonCol>
            <IonCol size="auto"></IonCol>
          </IonRow>
          <PhoneComp
            sessionItem={sessionItem}
            phoneUpdated={(newPhon: string) => {
              setCurrentBasicDTO({
                ...currentBasicDTO,
                loginCred: { ...currentBasicDTO.loginCred, phone: newPhon }
              });
            }}
          />
        </IonGrid>
      </IonCardContent>
    </IonCard>
  );
};

export default BasicCard;
