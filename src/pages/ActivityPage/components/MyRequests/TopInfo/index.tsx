import React from 'react';
import { IonRow, IonCol } from '@ionic/react';

import rejectedIcon from 'src/assets/icon/rejected.png';
import totalIcon from 'src/assets/icon/total.png';
import approvedIcon from 'src/assets/icon/approved.png';
import pendingIcon from 'src/assets/icon/pending.png';
import TopInfoCard from './TopInfoCard';

interface Props {
  verificationStatus: string[];
}

const TopInfo: React.FC<Props> = ({ verificationStatus }: Props) => {
  return (
    <IonRow>
      <IonCol>
        <TopInfoCard
          img={totalIcon}
          title="Total Requests"
          count={verificationStatus.length}
          bgColor="#1D1D1B"
        />
      </IonCol>
      <IonCol>
        <TopInfoCard
          img={approvedIcon}
          title="Approved"
          count={verificationStatus.filter(v => v === 'approved').length}
          bgColor="#2FD5DD"
        />
      </IonCol>
      <IonCol>
        <TopInfoCard
          img={pendingIcon}
          title="Pending"
          count={verificationStatus.filter(v => v === 'requested').length}
          bgColor="#FF9840"
        />
      </IonCol>
      <IonCol>
        <TopInfoCard
          img={rejectedIcon}
          title="Rejected"
          count={verificationStatus.filter(v => v === 'rejected').length}
          bgColor="#FF5A5A"
        />
      </IonCol>
    </IonRow>
  );
};

export default TopInfo;
