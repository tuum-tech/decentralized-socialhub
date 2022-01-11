import totalIcon from 'src/assets/icon/total.png';
import React from 'react';
import { IonButton, IonCol, IonGrid, IonRow } from '@ionic/react';
import { SmallLightButton } from 'src/elements/buttons';
import styled from 'styled-components';

export const RequestVerificationButton = styled(SmallLightButton)<{
  disabled: boolean;
}>`
  margin-left: 10px;
  background-color: #50c878;
  padding: 5px;
  color: ${props => {
    return props.disabled ? '#666666' : '#666666';
  }};
`;

type Props = {
  children?: React.ReactNode;
  onRequestVerification: any;
};
const VerificationRequestDecorator: React.FC<Props> = ({
  children,
  onRequestVerification
}) => (
  <IonGrid>
    <IonRow class="ion-align-items-end">
      <IonCol size="10" class="ion-no-padding">
        {children}
      </IonCol>
      <IonCol size="2" class="ion-no-padding">
        <RequestVerificationButton
          disabled={false}
          onClick={onRequestVerification}
        >
          Request Verification
        </RequestVerificationButton>{' '}
      </IonCol>
    </IonRow>
  </IonGrid>
);

export default VerificationRequestDecorator;
