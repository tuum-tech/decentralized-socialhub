import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal, IonTextarea } from '@ionic/react';

import { SmallLightButton } from 'src/elements/buttons';
import { TuumTechScriptService } from 'src/services/script.service';
import Expander from 'src/elements/Expander';

export const SelectedVerificationModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 600px;
  --height: 300px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const InfoTxt = styled.p`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #425466;
`;

const Container = styled.div`
  position: relative;
  padding: 40px;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .buttons {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;

    button {
      width: 40%;
    }
  }
`;

interface Props {
  verification: VerificationRequest;
  user: ISessionItem;
  approvable?: boolean;
}

const SelectedVerificationContent = ({
  verification,
  user,
  approvable = false
}: Props) => {
  const [loading, setLoading] = useState(0);
  const [feedbacks, setFeedbacks] = useState('');
  const { category, records } = verification;

  const handleAction = async (approve: boolean) => {
    setLoading(approve ? 1 : 2);

    const res = await TuumTechScriptService.updateVerificationRequest(
      verification.from_did,
      verification.to_did,
      verification.updated_at.toString(),
      approve ? 'approved' : 'rejected',
      verification.category,
      verification.msg,
      feedbacks
    );
    console.log(res);

    setLoading(0);
  };
  return (
    <Container>
      <p>{user.did}</p>
      <Expander title={category} cateogiries={records} />
      {approvable && verification.status === 'requested' && (
        <div className="buttons">
          <SmallLightButton onClick={async () => await handleAction(true)}>
            Approve{loading === 1 ? 'ing' : ''}
          </SmallLightButton>
          <SmallLightButton onClick={async () => await handleAction(false)}>
            Reject{loading === 2 ? 'ing' : ''}
          </SmallLightButton>
        </div>
      )}
      <InfoTxt>Feedbacks</InfoTxt>
      <IonTextarea
        placeholder="Enter a message for the verifiers"
        value={feedbacks}
        style={{
          background: '#EDF2F7',
          borderRadius: '8px'
        }}
        onIonChange={n => setFeedbacks(n.detail.value!)}
      />
    </Container>
  );
};

export default SelectedVerificationContent;
