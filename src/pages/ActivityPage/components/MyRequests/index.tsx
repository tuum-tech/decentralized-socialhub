import React, { useState } from 'react';
import styled from 'styled-components';
import { VerificationService } from 'src/services/verification.service';

import VerificationDetailContent, {
  VerificationDetailModal
} from './VerificationDetail';
import NewVerificationContent, {
  NewVerificationModal
} from './NewVerification';
import SentModalContent, { SentModal } from './SentModal';
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
  closeNewVerificationModal: () => void;
  showNewVerificationModal: boolean;
  verifications: VerificationRequest[];
}

const MyRequests: React.FC<Props> = ({
  session,
  closeNewVerificationModal,
  showNewVerificationModal,
  verifications
}: Props) => {
  const [showSentModal, setShowSentModal] = useState(false);
  const [selectedVerification, setSelectVerification] = useState<any>(null);

  const sendReuqest = async (
    dids: string[],
    credentials: VerificationData[],
    msg: string
  ) => {
    const vService = new VerificationService();
    await vService.sendRequest(session.did, dids, credentials, msg);
    closeNewVerificationModal();
    setShowSentModal(true);
  };

  return (
    <PageContainer>
      <TopInfo verificationStatus={verifications.map((v: any) => v.status)} />

      <PageContent>
        <UserRows
          session={session}
          verifications={verifications}
          setSelectVerification={setSelectVerification}
        />
      </PageContent>
      <NewVerificationModal
        isOpen={showNewVerificationModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <NewVerificationContent
          session={session}
          onClose={closeNewVerificationModal}
          targetUser={session}
          sendRequest={sendReuqest}
        />
      </NewVerificationModal>

      <SentModal
        isOpen={showSentModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <SentModalContent
          onClose={() => {
            setShowSentModal(false);
          }}
        />
      </SentModal>
      <VerificationDetailModal
        isOpen={selectedVerification !== null}
        onDidDismiss={() => setSelectVerification(null)}
      >
        {selectedVerification !== null && (
          <VerificationDetailContent
            verification={selectedVerification.verification}
            user={selectedVerification.user}
            me={session}
            onClose={() => setSelectVerification(null)}
          />
        )}
      </VerificationDetailModal>
    </PageContainer>
  );
};

export default MyRequests;
