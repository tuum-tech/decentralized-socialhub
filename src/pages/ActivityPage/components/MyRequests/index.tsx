import React, { useState } from 'react';
import styled from 'styled-components';
import { IonRow, IonCol, IonModal } from '@ionic/react';

import NewVerification from './NewVerification';
import TopInfoCard from '../TopInfoCard';
import UserRows from './UserRows';

const PageContainer = styled.div`
  padding: 0 20px 20px 20px;
`;

const PageContent = styled.div`
  background: #ffffff;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  border-radius: 16px;
  padding: 17px 20px;
`;

const NewVerificationModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 1100px;
  --height: 678px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  session: ISessionItem;
  closeNewVerificationModal: () => void;
  showNewVerificationModal: boolean;
}

const MyRequests: React.FC<Props> = ({
  session,
  closeNewVerificationModal,
  showNewVerificationModal
}: Props) => {
  const [showModal, setShowModal] = useState(false); // svID: selected verification ID

  return (
    <PageContainer>
      <IonRow>
        <IonCol>
          <TopInfoCard
            img=""
            title="Total Requestss"
            text="1.2K"
            bgColor="#1D1D1B"
          />
        </IonCol>
        <IonCol>
          <TopInfoCard img="" title="Approved" text="1.2K" bgColor="#2FD5DD" />
        </IonCol>
        <IonCol>
          <TopInfoCard img="" title="Pending" text="1.2K" bgColor="#FF9840" />
        </IonCol>
        <IonCol>
          <TopInfoCard img="" title="Rejected" text="1.2K" bgColor="#FF5A5A" />
        </IonCol>
      </IonRow>
      <PageContent>
        <UserRows session={session} />
      </PageContent>
      <NewVerificationModal
        isOpen={showNewVerificationModal}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <NewVerification
          session={session}
          onClose={closeNewVerificationModal}
          targetUser={session}
        />
      </NewVerificationModal>
    </PageContainer>
  );
};

export default MyRequests;
