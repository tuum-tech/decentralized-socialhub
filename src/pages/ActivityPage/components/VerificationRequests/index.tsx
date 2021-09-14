import React, { useState, useEffect } from 'react';

import { TuumTechScriptService } from 'src/services/script.service';
import UserRows from './UserRows';
import { PageContainer, PageContent } from '../MyRequests';
import TopInfo from '../MyRequests/TopInfo';
import SelectedVerificationContent, {
  SelectedVerificationModal
} from '../MyRequests/SelectedVerification';

interface Props {
  session: ISessionItem;
}

const MyRequests: React.FC<Props> = ({ session }: Props) => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [selectedVerification, setSelectVerification] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const requests_by_me: Verification[] = await TuumTechScriptService.getVerifications(
        session.did,
        false
      );
      setVerifications(requests_by_me);
    })();
  }, [session.did]);

  return (
    <PageContainer>
      <TopInfo verificationStatus={verifications.map((v: any) => v.status)} />
      <PageContent>
        <UserRows
          setSelectVerification={setSelectVerification}
          session={session}
          verifications={verifications}
        />
        <SelectedVerificationModal
          isOpen={selectedVerification !== null}
          onDidDismiss={() => setSelectVerification(null)}
        >
          {selectedVerification !== null && (
            <SelectedVerificationContent
              verification={selectedVerification.verification}
              user={selectedVerification.user}
              approvable={true}
            />
          )}
        </SelectedVerificationModal>
      </PageContent>
    </PageContainer>
  );
};

export default MyRequests;
