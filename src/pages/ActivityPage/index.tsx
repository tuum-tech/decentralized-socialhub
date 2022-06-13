import React, { useEffect, useState } from 'react';

import { TuumTechScriptService } from 'src/services/script.service';
import ActivityTimeline from './components/ActivityTimeline';
import VerificationRequests from './components/VerificationRequests';
import MyRequests from './components/MyRequests';
import Referrals from './components/Referrals';
import ActivityPageHeader, {
  ActivityTabsContainer
} from './components/ActivityPageHeader';

import MainLayout from 'src/components/layouts/MainLayout';
import useSession from 'src/hooks/useSession';
import HeaderMenu from 'src/elements-v2/HeaderMenu';
import { Header } from 'src/components/layouts/MainLayout/Header';

const ActivityPage: React.FC = () => {
  const { session } = useSession();
  const [active, setActive] = useState('timeline'); // timeline or veificationrequests
  const [myverifications, setMyVerification] = useState<VerificationRequest[]>(
    []
  );
  const [verificationRequests, setVerificationRequests] = useState<
    VerificationRequest[]
  >([]);
  const [referrals, setReferrals] = useState<IReferral[]>([]);

  const fetchMyVerifications = async () => {
    const requests_by_me: VerificationRequest[] = await TuumTechScriptService.getVerificationRequests(
      session.did,
      true
    );
    setMyVerification(requests_by_me);
  };

  const fetchVerificationRequestToMe = async () => {
    const vRequests: VerificationRequest[] = await TuumTechScriptService.getVerificationRequests(
      session.did,
      false
    );
    setVerificationRequests(vRequests);
  };

  const fetchReferrals = async () => {
    const referrals: IReferral[] = await TuumTechScriptService.getReferrals(
      session.did
    );
    setReferrals(referrals);
  };

  useEffect(() => {
    (async () => {
      await fetchMyVerifications();
      await fetchVerificationRequestToMe();
      await fetchReferrals();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.did]);

  const [showNewVerificationModal, setShowNewVerificationModal] = useState(
    false
  );

  return (
    <MainLayout>
      <Header>
        <HeaderMenu title="Activities" />
      </Header>

      <ActivityTabsContainer template="default">
        <ActivityPageHeader
          active={active}
          setActive={setActive}
          myverifications={myverifications.length}
          referrals={referrals.filter(v => v.sign_up_date === undefined).length}
          verificationRequests={
            verificationRequests.filter(x => x.status === 'requested').length
          }
          newVerificationClicked={() =>
            setShowNewVerificationModal(!showNewVerificationModal)
          }
        />
        {active === 'timeline' && <ActivityTimeline session={session} />}
        {active === 'myrequests' && (
          <MyRequests
            verifications={myverifications}
            session={session}
            showNewVerificationModal={showNewVerificationModal}
            closeNewVerificationModal={() => setShowNewVerificationModal(false)}
            refresh={fetchMyVerifications}
          />
        )}
        {active === 'verificationrequests' && (
          <VerificationRequests
            session={session}
            verifications={verificationRequests}
            forceReFetch={async () => {
              await fetchVerificationRequestToMe();
            }}
          />
        )}
        {active === 'referrals' && (
          <Referrals session={session} referrals={referrals} />
        )}
      </ActivityTabsContainer>
    </MainLayout>
  );
};

export default ActivityPage;
