import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { DefaultButton } from 'src/elements-v2/buttons';

type Props = {
  children?: React.ReactNode;
  onRequestVerification: any;
  showButton: boolean;
  disabled: boolean;
};
const VerificationRequestDecorator: React.FC<Props> = ({
  children,
  onRequestVerification,
  showButton,
  disabled
}) => (
  <IonGrid class="ion-no-padding">
    <IonRow class="ion-align-items-end ion-no-padding">
      <IonCol class="ion-no-padding">{children}</IonCol>
      <IonCol size="auto" class="ion-no-padding">
        {showButton && (
          <DefaultButton
            size="small"
            variant="outlined"
            btnColor="primary-gradient"
            textType="gradient"
            disabled={disabled}
            onClick={onRequestVerification}
          >
            Request Verification
          </DefaultButton>
        )}
      </IonCol>
    </IonRow>
  </IonGrid>
);

export default VerificationRequestDecorator;
