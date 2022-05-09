import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { DefaultButton } from 'src/elements-v2/buttons';

type Props = {
  children?: React.ReactNode;
  onRequestVerification: any;
  v: string;
};
const VerificationRequestDecorator: React.FC<Props> = ({
  children,
  onRequestVerification,
  v
}) => (
  <IonGrid class="ion-no-padding">
    <IonRow class="ion-align-items-end ion-no-padding">
      <IonCol class="ion-no-padding">{children}</IonCol>
      <IonCol size="auto" class="ion-no-padding">
        {v !== undefined && v !== '' ? (
          <DefaultButton
            size="small"
            variant="outlined"
            btnColor="primary-gradient"
            textType="gradient"
            disabled={false}
            onClick={onRequestVerification}
          >
            Request Verification
          </DefaultButton>
        ) : (
          ''
        )}
      </IonCol>
    </IonRow>
  </IonGrid>
);

export default VerificationRequestDecorator;
