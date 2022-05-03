import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { ProfileService } from 'src/services/profile.service';
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
  referrals: IReferral[];
}

const Referrals: React.FC<Props> = ({ session, referrals }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState('');
  const [filteredRefersals, setFilteredReferals] = useState(referrals || []);
  const [following, setFollowings] = useState<string[]>([]);

  useEffect(() => {
    if (selectedStatus === '') {
      setFilteredReferals(referrals || []);
    } else if (selectedStatus === 'approved') {
      setFilteredReferals(
        (referrals || []).filter((r: IReferral) => r.sign_up_date)
      );
    } else if (selectedStatus === 'requested') {
      setFilteredReferals(
        (referrals || []).filter((r: IReferral) => r.sign_up_date === undefined)
      );
    }
  }, [selectedStatus, referrals]);

  const retrieveFollows = useCallback(async () => {
    if (session && session.did && session.tutorialStep === 4) {
      try {
        let following = await ProfileService.getFollowings(session.did);
        if (following) {
          setFollowings((following.get_following.items || []).map(f => f.did));
        }
      } catch (e) {}
    }
  });

  const followClicked = async (isFollowing: boolean, did: string) => {
    if (isFollowing) {
      await ProfileService.addFollowing(did, session);
    } else {
      await ProfileService.unfollow(did, session);
    }

    await retrieveFollows();
  };

  useEffect(() => {
    (async () => {
      await retrieveFollows();
    })();
  }, [retrieveFollows, session.did]);

  return (
    <PageContainer>
      <TopInfo referrals={referrals || []} selectStatus={setSelectedStatus} />

      <PageContent>
        <UserRows
          followClicked={followClicked}
          referrals={filteredRefersals}
          following={following}
          session={session}
        />
      </PageContent>
    </PageContainer>
  );
};

export default Referrals;
