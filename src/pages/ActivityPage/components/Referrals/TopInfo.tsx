import React from 'react';
import { IonRow } from '@ionic/react';

import { ClickableCol, TopInfoCard } from '../TopInfoCard';
import totalIcon from 'src/assets/icon/total.png';
import approvedIcon from 'src/assets/icon/approved.png';
import pendingIcon from 'src/assets/icon/pending.png';

interface Props {
  referrals: IReferral[];
  selectStatus: any;
}

const TopInfo: React.FC<Props> = ({ referrals, selectStatus }: Props) => {
  return (
    <IonRow>
      <ClickableCol onClick={() => selectStatus('')}>
        <TopInfoCard
          img={totalIcon}
          title="Total Referrals"
          count={referrals.length}
          bgColor="#1D1D1B"
        />
      </ClickableCol>
      <ClickableCol onClick={() => selectStatus('completed')}>
        <TopInfoCard
          img={approvedIcon}
          title="Completed"
          count={referrals.filter(v => v.sign_up_date !== undefined).length}
          bgColor="#2FD5DD"
        />
      </ClickableCol>
      <ClickableCol onClick={() => selectStatus('requested')}>
        <TopInfoCard
          img={pendingIcon}
          title="Pending"
          count={referrals.filter(v => v.sign_up_date === undefined).length}
          bgColor="#FF9840"
        />
      </ClickableCol>
    </IonRow>
  );
};

export default TopInfo;
