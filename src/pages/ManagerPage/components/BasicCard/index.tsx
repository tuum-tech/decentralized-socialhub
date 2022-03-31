import React, { useEffect, useState } from 'react';
import {
  IonCardTitle,
  IonCardHeader,
  IonCard,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol
} from '@ionic/react';
import { isEqual } from 'lodash';
import styled from 'styled-components';

import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import EmailComp, { SaveButton } from './EmailComp';
import PhoneComp from './PhoneComp';
import VerificationRequestDecorator from 'src/pages/ActivityPage/components/VerificationRequests/VerificationRequestDecorator';

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  text-align: center;
  margin-top: 20px;
  margin-bottom: 5px;

  background-color: #f7fafc;
`;

interface IProps {
  sessionItem: ISessionItem;
  updateFunc: any;
  requestVerification: any;
}

const BasicCard: React.FC<IProps> = ({
  sessionItem,
  updateFunc,
  requestVerification
}: IProps) => {
  const [currentBasicDTO, setCurrentBasicDTO] = useState(sessionItem);
  const handleChange = (evt: any) => {
    const value =
      evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;

    setCurrentBasicDTO({
      ...currentBasicDTO,
      [evt.target.name]: value
    });
  };

  useEffect(() => {
    setCurrentBasicDTO(sessionItem);
  }, [sessionItem]);

  return (
    <IonCard className={styleWidget['overview']}>
      <IonCardHeader>
        <IonGrid>
          <IonRow class="ion-justify-content-between">
            <IonCol>
              <IonCardTitle>Basic Information</IonCardTitle>
            </IonCol>
            <IonCol size="auto">
              <SaveButton
                disabled={
                  sessionItem.tutorialStep !== 4 ||
                  isEqual(sessionItem, currentBasicDTO)
                }
                onClick={() => updateFunc(currentBasicDTO)}
              >
                Save
              </SaveButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow class="ion-justify-content-start">
            <IonCol size="7">
              <VerificationRequestDecorator
                v={currentBasicDTO.name}
                onRequestVerification={() =>
                  requestVerification(`Name: ${currentBasicDTO.name}`)
                }
              >
                <SmallTextInput
                  disabled={sessionItem.tutorialStep !== 4}
                  label="Name"
                  name="name"
                  value={currentBasicDTO.name}
                  onChange={handleChange}
                />
              </VerificationRequestDecorator>
            </IonCol>
          </IonRow>

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

          <Divider />

          <VerificationRequestDecorator
            v={currentBasicDTO.loginCred?.email as string}
            onRequestVerification={() =>
              requestVerification(`Email: ${currentBasicDTO.loginCred?.email}`)
            }
          >
            <EmailComp
              sessionItem={sessionItem}
              emailUpdated={(newEmail: string) => {
                updateFunc({
                  ...currentBasicDTO,
                  loginCred: { ...currentBasicDTO.loginCred, email: newEmail }
                });
              }}
            />
          </VerificationRequestDecorator>
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
