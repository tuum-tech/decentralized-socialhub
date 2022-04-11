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
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  return (
    <PageContainer>
      <TopInfo
        verificationStatus={verifications.map((v: any) => v.status)}
        selectStatus={(status: string) => {
          setSelectedStatus(status);
        }}
      />
      <PageContent>
        <UserRows
          setSelectVerification={setSelectVerification}
          session={session}
          verifications={verifications.filter((v: any) =>
            selectedStatus ? v.status === selectedStatus : true
          )}
        />
        <VerificationDetailModal
          isOpen={selectedVerification !== null}
          onDidDismiss={() => setSelectVerification(null)}
        >
          {selectedVerification !== null && (
            <VerificationDetailContent
              verification={selectedVerification.verification}
              user={selectedVerification.user}
              session={session}
              closeModal={async () => {
                setSelectVerification(null);
                await forceReFetch();
              }}
            />
          )}
        </VerificationDetailModal>
      </PageContent>
    </PageContainer>
  );
};

export default VerificationRequests;
