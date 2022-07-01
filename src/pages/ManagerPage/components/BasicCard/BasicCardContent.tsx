import React, { useCallback, useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';

import SmallTextInput from 'src/elements/inputs/SmallTextInput';
import EmailComp from './EmailComp';
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
  isEdit?: boolean;
  closeModal?: () => void;
}

const BasicCardConent = ({
  sessionItem,
  updateFunc,
  requestVerification,
  isEdit,
  closeModal
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [currentBasicDTO, setCurrentBasicDTO] = useState(sessionItem);
  const handleChange = useCallback(
    (evt: any) => {
      const value =
        evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value;

      setCurrentBasicDTO({
        ...currentBasicDTO,
        [evt.target.name]: value
      });
    },
    [currentBasicDTO]
  );

  useEffect(() => {
    setCurrentBasicDTO(sessionItem);
  }, [sessionItem]);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    await updateFunc(currentBasicDTO);
    setLoading(false);
    if (closeModal) {
      closeModal();
    }
  }, [closeModal, currentBasicDTO, updateFunc]);

  return (
    <IonGrid className="ion-no-padding">
      <VerificationRequestDecorator
        showButton={!isEdit}
        onRequestVerification={() =>
          requestVerification(`Name: ${currentBasicDTO.name}`)
        }
      >
        <IonRow class="ion-justify-content-start ion-no-padding">
          <IonCol sizeXs="10" sizeSm="5" className="ion-no-padding">
            <SmallTextInput
              disabled={!sessionItem.onBoardingCompleted || !isEdit}
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
        showButton={!isEdit}
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
          isEdit={isEdit}
        />
      </VerificationRequestDecorator>

      {isEdit && (
        <IonRow className="ion-justify-content-start pt-5">
          <DefaultButton
            variant="contained"
            btnColor="primary-gradient"
            style={{ minWidth: 100 }}
            loading={loading}
            onClick={handleSubmit}
          >
            Save
          </DefaultButton>
        </IonRow>
      )}
    </IonGrid>
  );
};

export default BasicCardConent;
