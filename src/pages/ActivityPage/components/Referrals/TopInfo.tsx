import React from 'react';
import { IonRow, IonCol } from '@ionic/react';

import totalIcon from 'src/assets/icon/total.png';
import approvedIcon from 'src/assets/icon/approved.png';
import pendingIcon from 'src/assets/icon/pending.png';
import TopInfoCard from '../MyRequests/TopInfo/TopInfoCard';
import styled from 'styled-components';

interface Props {
  referrals: IReferral[];
  selectStatus: any;
}

const ClicableCol = styled(IonCol)`
  cursor: pointer;
  &:hover {
    div {
      background: #f3f3f3;
    }
  }
`;

const TopInfo: React.FC<Props> = ({ referrals, selectStatus }: Props) => {
  return (
    <IonRow>
      <ClicableCol onClick={() => selectStatus('')}>
        <TopInfoCard
          img={totalIcon}
          title="Total Referrals"
          count={referrals.length}
          bgColor="#1D1D1B"
        />
      </ClicableCol>
      <ClicableCol onClick={() => selectStatus('completed')}>
        <TopInfoCard
          img={approvedIcon}
          title="Completed"
          count={referrals.filter(v => v.sign_up_date != undefined).length}
          bgColor="#2FD5DD"
        />
      </ClicableCol>
      <ClicableCol onClick={() => selectStatus('requested')}>
        <TopInfoCard
          img={pendingIcon}
          title="Pending"
          count={referrals.filter(v => v.sign_up_date == undefined).length}
          bgColor="#FF9840"
        />
      </ClicableCol>
    </IonRow>
  );
};

export default TopInfo;
