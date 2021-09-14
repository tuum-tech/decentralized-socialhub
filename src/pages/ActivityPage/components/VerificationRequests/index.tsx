import React, { useState } from 'react';

import UserRows from './UserRows';
import { PageContainer, PageContent } from '../MyRequests';
import TopInfo from '../MyRequests/TopInfo';
import SelectedVerificationContent, {
  SelectedVerificationModal
} from '../MyRequests/SelectedVerification';

interface Props {
  session: ISessionItem;
  verifications: Verification[];
}

const MyRequests: React.FC<Props> = ({ session, verifications }: Props) => {
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
