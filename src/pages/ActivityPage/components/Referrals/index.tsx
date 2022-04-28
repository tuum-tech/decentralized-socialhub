import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import UserRows from './UserRows';
import TopInfo from './TopInfo';

export const PageContainer = styled.div`
  padding: 0 20px 20px 20px;
`;

export const PageContent = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  padding: 17px 20px;
`;

interface Props {
  session: ISessionItem;
}

const Referrals: React.FC<Props> = ({ session }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState('');

  const [filteredRefersals, setFilteredReferals] = useState(
    session.referrals || []
  );

  useEffect(() => {
    if (selectedStatus === '') {
      setFilteredReferals(session.referrals || []);
    } else if (selectedStatus === 'approved') {
      setFilteredReferals(
        (session.referrals || []).filter((r: IReferral) => r.sign_up_date)
      );
    } else if (selectedStatus === 'requested') {
      setFilteredReferals(
        (session.referrals || []).filter(
          (r: IReferral) => r.sign_up_date === undefined
        )
      );
    }
  }, [selectedStatus, session.referrals]);

  return (
    <PageContainer>
      <TopInfo
        referrals={session.referrals || []}
        selectStatus={setSelectedStatus}
      />

      <PageContent>
        <UserRows referrals={filteredRefersals} />
      </PageContent>
    </PageContainer>
  );
};

export default Referrals;
