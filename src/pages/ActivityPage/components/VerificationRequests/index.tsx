import React, { useState } from 'react';

import UserRows from './UserRows';
import { PageContainer, PageContent } from '../MyRequests';
import TopInfo from '../MyRequests/TopInfo';
import VerificationDetailContent, {
  VerificationDetailModal
} from './VerificationDetail';

interface Props {
  session: ISessionItem;
  verifications: VerificationRequest[];
  forceReFetch: () => void;
}

const VerificationRequests: React.FC<Props> = ({
  session,
  verifications,
  forceReFetch
}: Props) => {
  const [selectedVerification, setSelectVerification] = useState<any>(null);

  return (
    <PageContainer>
      <TopInfo verificationStatus={verifications.map((v: any) => v.status)} />
      <PageContent>
        <UserRows
          setSelectVerification={setSelectVerification}
          session={session}
          verifications={verifications}
        />
        <VerificationDetailModal
          isOpen={selectedVerification !== null}
          onDidDismiss={() => setSelectVerification(null)}
        >
          {selectedVerification !== null && (
            <VerificationDetailContent
              verification={selectedVerification.verification}
              user={selectedVerification.user}
              closeModal={() => {
                setSelectVerification(null);
                forceReFetch();
              }}
            />
          )}
        </VerificationDetailModal>
      </PageContent>
    </PageContainer>
  );
};

export default VerificationRequests;
