import React from 'react';
import { IonCard, IonCardContent, IonCardHeader } from '@ionic/react';

import { CardTitle, MainCard } from './ProfileCompletion';

const VerificationStatus: React.FC = ({}) => {
  return (
    <MainCard>
      <IonCardHeader>
        <CardTitle>Verification status</CardTitle>
      </IonCardHeader>
      <IonCardContent></IonCardContent>
    </MainCard>
  );
};

export default VerificationStatus;
