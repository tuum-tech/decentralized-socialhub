import React, { useEffect, useState } from 'react';
import { IonCardTitle, IonGrid, IonRow, IonCol } from '@ionic/react';
import { isEqual } from 'lodash';
import styled from 'styled-components';

import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import EmailComp from './EmailComp';
import PhoneComp from './PhoneComp';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import VerificationRequestDecorator from 'src/pages/ActivityPage/components/VerificationRequests/VerificationRequestDecorator';
import { DefaultButton } from 'src/elements-v2/buttons';

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
    <CardOverview template="default">
      <CardHeaderContent>
        <IonGrid className="ion-no-padding">
          <IonRow class="ion-justify-content-between ion-no-padding">
            <IonCol className="ion-no-padding">
              <IonCardTitle>Basic Information</IonCardTitle>
            </IonCol>
            <IonCol size="auto" className="ion-no-padding">
              <DefaultButton
                size="small"
                variant="outlined"
                btnColor="primary-gradient"
                textType="gradient"
                disabled={
                  sessionItem.tutorialStep !== 4 ||
                  isEqual(sessionItem, currentBasicDTO)
                }
                onClick={() => updateFunc(currentBasicDTO)}
              >
                Save
              </DefaultButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </CardHeaderContent>
      <CardContentContainer>
        <IonGrid className="ion-no-padding">
          <VerificationRequestDecorator
            v={currentBasicDTO.name}
            onRequestVerification={() =>
              requestVerification(`Name: ${currentBasicDTO.name}`)
            }
          >
            <IonRow class="ion-justify-content-start ion-no-padding">
              <IonCol size="5" className="ion-no-padding">
                <SmallTextInput
                  disabled={sessionItem.tutorialStep !== 4}
                  label="Name"
                  name="name"
                  value={currentBasicDTO.name}
                  onChange={handleChange}
                />
              </IonCol>
            </IonRow>
          </VerificationRequestDecorator>

          <IonRow class="ion-justify-content-start ion-no-padding">
            <IonCol size="7" className="ion-no-padding">
              <SmallTextInput
                disabled={true}
                label="DID"
                value={currentBasicDTO.did}
                onChange={handleChange}
              />
            </IonCol>
          </IonRow>
          <IonRow class="ion-justify-content-start ion-no-padding">
            <IonCol size="7" className="ion-no-padding">
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
      </CardContentContainer>
    </CardOverview>
  );
};

export default BasicCard;
