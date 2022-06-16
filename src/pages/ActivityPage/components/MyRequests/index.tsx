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
import CancelRequestModalContent, {
  CancelRequestModal
} from './CancelRequestModal';

export const PageContainer = styled.div`
  padding: 0 20px 20px 20px;
`;

export const PageContent = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  padding: 17px 20px;
  margin-top: 38px;
`;

interface Props {
  session: ISessionItem;
  closeNewVerificationModal: () => void;
  refresh: () => void;
  showNewVerificationModal: boolean;
  verifications: VerificationRequest[];
}

const MyRequests: React.FC<Props> = ({
  session,
  closeNewVerificationModal,
  refresh,
  showNewVerificationModal,
  verifications
}: Props) => {
  const [showSentModal, setShowSentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [
    showVerificationDetailModal,
    setShowVerificationDetailModal
  ] = useState(false);
  const [selectedVerification, setSelectVerification] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState('');

  const sendRequest = async (
    dids: string[],
    credentials: VerificationData[],
    msg: string
  ) => {
    const vService = new VerificationService();
    await vService.sendRequest(session, dids, credentials, msg);
    closeNewVerificationModal();
    setShowSentModal(true);
  };

  const cancelVerification = async (v: VerificationRequest) => {
    setSelectVerification({ verification: v, undefined });

    setShowCancelModal(true);
    //const vService = new VerificationService();
    //await vService.cancelRequest(session, v);
  };

  return (
    <PageContainer>
      <TopInfo
        verificationStatus={verifications.map((v: any) => v.status)}
        selectStatus={setSelectedStatus}
      />

      <PageContent>
        <UserRows
          session={session}
          verifications={
            selectedStatus === ''
              ? verifications
              : verifications.filter(v => v.status === selectedStatus)
          }
          setSelectVerification={(v: any) => {
            setSelectVerification(v);
            setShowVerificationDetailModal(true);
          }}
          cancelVerification={cancelVerification}
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
          sendRequest={sendRequest}
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
            refresh();
          }}
        />
      </SentModal>
      <VerificationDetailModal
        isOpen={showVerificationDetailModal}
        onDidDismiss={() => {
          setSelectVerification(null);
          setShowVerificationDetailModal(false);
        }}
      >
        {selectedVerification !== null && (
          <VerificationDetailContent
            verification={selectedVerification.verification}
            user={session}
            onClose={() => {
              setSelectVerification(null);
              setShowVerificationDetailModal(false);
              refresh();
            }}
          />
        )}
      </VerificationDetailModal>

      <CancelRequestModal
        isOpen={showCancelModal}
        onDidDismiss={() => setSelectVerification(null)}
      >
        {selectedVerification !== null && (
          <CancelRequestModalContent
            verification={selectedVerification.verification}
            onConfirm={async (v: any) => {
              const vService = new VerificationService();
              await vService.cancelRequest(session, v);
              setShowCancelModal(false);
              refresh();
            }}
            onAbort={() => {
              setShowCancelModal(false);
            }}
          />
        )}
      </CancelRequestModal>
    </PageContainer>
  );
};

export default MyRequests;
