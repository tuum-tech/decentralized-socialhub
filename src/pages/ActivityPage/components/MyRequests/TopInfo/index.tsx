import React from 'react';
import { IonRow, IonCol } from '@ionic/react';

import rejectedIcon from 'src/assets/icon/rejected.png';
import totalIcon from 'src/assets/icon/total.png';
import approvedIcon from 'src/assets/icon/approved.png';
import pendingIcon from 'src/assets/icon/pending.png';
import shield from 'src/assets/icon/pending.png';
import TopInfoCard from './TopInfoCard';
import styled from 'styled-components';

interface Props {
  verificationStatus: string[];
  selectStatus: any;
}

const ClickableCol = styled(IonCol)`
  cursor: pointer;
  &:hover {
    div {
      background: #f3f3f3;
    }
  }
`;

const TopInfo: React.FC<Props> = ({
  verificationStatus,
  selectStatus
}: Props) => {
  return (
    <IonRow>
      <ClickableCol onClick={() => selectStatus('')}>
        <TopInfoCard
          img={totalIcon}
          title="Total Requests"
          count={verificationStatus.length}
          bgColor="#1D1D1B"
        />
      </ClickableCol>
      <ClickableCol onClick={() => selectStatus('approved')}>
        <TopInfoCard
          img={approvedIcon}
          title="Approved"
          count={verificationStatus.filter(v => v === 'approved').length}
          bgColor="#2FD5DD"
        />
      </ClickableCol>
      <ClickableCol onClick={() => selectStatus('requested')}>
        <TopInfoCard
          img={pendingIcon}
          title="Pending"
          count={verificationStatus.filter(v => v === 'requested').length}
          bgColor="#FF9840"
        />
      </ClickableCol>
      <ClickableCol onClick={() => selectStatus('rejected')}>
        <TopInfoCard
          img={rejectedIcon}
          title="Rejected"
          count={verificationStatus.filter(v => v === 'rejected').length}
          bgColor="#FF5A5A"
        />
      </ClickableCol>
      <ClickableCol onClick={() => selectStatus('saved to identity')}>
        <TopInfoCard
          img={shield}
          title="Saved to identity"
          count={
            verificationStatus.filter(v => v === 'saved to identity').length
          }
          bgColor="#FF5A5A"
        />
      </ClickableCol>
    </IonRow>
  );
};

export default TopInfo;
