import React, { useState } from 'react';
import styled from 'styled-components';
import { IonTextarea, IonModal } from '@ionic/react';
import { Link } from 'react-router-dom';

import { SmallLightButton } from 'src/elements/buttons';
import { TuumTechScriptService } from 'src/services/script.service';
import Expander from 'src/elements/Expander';
import { timeSince } from 'src/utils/time';
import DidSnippet from 'src/elements/DidSnippet';
import Avatar from 'src/components/Avatar';

import { InfoTxt, Container } from '../MyRequests/VerificationDetail';
import { getStatusColor } from '../MyRequests/UserRows';

export const VerificationDetailModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 1100px;
  --height: 678px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const RowContainer = styled(Container)`
  display: flex;
  flex-direction: row;
`;

const ProfileContent = styled.div`
  width: 40%;
  background: #edf2f7;
  border-radius: 12px 0px 0px 12px;

  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  padding: 20px;

  .name {
    margin-top: 15px;
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    text-align: center;
    color: #27272e;
  }
`;
const ContentArea = styled.div`
  width: 60%;
  background: #fafafa;
  border-radius: 0px 12px 12px 0px;
  padding: 20px;
`;

interface Props {
  verification: VerificationRequest;
  user: ISessionItem;
  closeModal: () => void;
}

const VerificationDetailContent = ({
  verification,
  user,
  closeModal
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

    closeModal();
  };

  return (
    <RowContainer>
      <ProfileContent>
        <Avatar did={verification.from_did} />
        <p className="mb-2 name">{user.name}</p>
        <DidSnippet did={user.did} />

        <Link className="mt-2" to={'/did/' + user.did}>
          View Profile
        </Link>
      </ProfileContent>

      <ContentArea>
        <p className="bottom mt-4" style={{ display: 'flex' }}>
          {timeSince(new Date(verification.updated_at))}
          <li
            style={{
              color: getStatusColor(verification.status),
              marginLeft: ' 20px'
            }}
          >
            {verification.status}
          </li>
        </p>

        <Expander title={category} cateogiries={records} />
        {verification.status === 'requested' && (
          <div className="buttons">
            <SmallLightButton onClick={async () => await handleAction(true)}>
              Approve{loading === 1 ? 'ing' : ''}
            </SmallLightButton>
            <SmallLightButton onClick={async () => await handleAction(false)}>
              Reject{loading === 2 ? 'ing' : ''}
            </SmallLightButton>
          </div>
        )}

        {verification.msg && verification.msg !== '' && (
          <div className="mt-4 mb-2">
            <InfoTxt>Message</InfoTxt>
            <p>{verification.msg}</p>
          </div>
        )}

        {verification.status !== 'requested' ? (
          <div className="mt-4 mb-2">
            <InfoTxt>Feedbacks</InfoTxt>
            <p>{verification.feedbacks}</p>
          </div>
        ) : (
          <div className="mt-4 mb-2">
            <InfoTxt> Feedbacks</InfoTxt>
            <IonTextarea
              placeholder="Enter a message for the verifiers"
              value={feedbacks}
              style={{
                background: '#EDF2F7',
                borderRadius: '8px'
              }}
              onIonChange={n => setFeedbacks(n.detail.value!)}
            />
          </div>
        )}
      </ContentArea>
    </RowContainer>
  );
};

export default VerificationDetailContent;
