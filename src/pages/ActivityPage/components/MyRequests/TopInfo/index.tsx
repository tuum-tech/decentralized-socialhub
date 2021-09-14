import React from 'react';
import { IonRow, IonCol } from '@ionic/react';

import TopInfoCard from './TopInfoCard';

interface Props {
  verificationStatus: string[];
}

const TopInfo: React.FC<Props> = ({ verificationStatus }: Props) => {
  return (
    <IonRow>
      <IonCol>
        <TopInfoCard
          img=""
          title="Total Requestss"
          count={verificationStatus.length}
          bgColor="#1D1D1B"
        />
      </IonCol>
      <IonCol>
        <TopInfoCard
          img=""
          title="Approved"
          count={verificationStatus.filter(v => v === 'approved').length}
          bgColor="#2FD5DD"
        />
      </IonCol>
      <IonCol>
        <TopInfoCard
          img=""
          title="Pending"
          count={verificationStatus.filter(v => v === 'requested').length}
          bgColor="#FF9840"
        />
      </IonCol>
      <IonCol>
        <TopInfoCard
          img=""
          title="Rejected"
          count={verificationStatus.filter(v => v === 'rejected').length}
          bgColor="#FF5A5A"
        />
      </IonCol>
    </IonRow>
  );
};

export default TopInfo;
