import React, { useState } from 'react';
import styled from 'styled-components';
import { IonTextarea, IonModal } from '@ionic/react';
import { Link } from 'react-router-dom';

// import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/';
// import { UserService } from 'src/services/user.service';
// import { DidService } from 'src/services/did.service.new';
// import { EssentialsService } from 'src/services/essentials.service';

import { StyledButton } from 'src/elements/buttons';
import Expander from 'src/elements/Expander';
import DidSnippet from 'src/elements/DidSnippet';
import CloseIcon from 'src/elements/svg/Close';
import Avatar from 'src/components/Avatar';
import { InfoTxt, Container } from '../MyRequests/VerificationDetail';
import { getStatusColor } from '../common';

import { VerificationService } from 'src/services/verification.service';

import { timeSince } from 'src/utils/time';
import { getDIDString } from 'src/utils/did';
import { getCategoryTitle } from 'src/utils/credential';

export const VerificationDetailModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 807px;
  --height: 678px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const RowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 40px 40px 0px 40px;
`;

const RowFooter = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0px 40px 40px 40px;
  .buttons {
    display: flex;
    justify-content: space-between;
    button {
      padding: 12px 20px;
    }
  }
`;
const Title = styled.div`
  h4 {
    font-size: 28px;
    font-weight: 600;
    line-height: 136.02%;
  }
`;

const RowContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  padding: 0px 40px;
  margin: 40px 0px;
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
  overflow-y: auto;
  height: auto;
  h4 {
    font-size: 16px;
    font-weight: 600;
    line-height: 25px;
  }
`;
interface Props {
  verification: VerificationRequest;
  user: ISessionItem;
  session: ISessionItem;
  closeModal: () => void;
}

const VerificationDetailContent = ({
  verification,
  user,
  session,
  closeModal
}: Props) => {
  const [loading, setLoading] = useState(0);
  const [feedbacks, setFeedbacks] = useState('');
  const { records } = verification;

  const handleAction = async (approve: boolean) => {
    setLoading(approve ? 1 : 2);

    const vService = new VerificationService();
    await vService.approveCredential(session, verification, approve, feedbacks);
    setLoading(0);
    closeModal();
  };

  return (
    <>
      <RowHeader>
        <Title>
          <h4>Verification Request</h4>
          <p className="bottom mt-1" style={{ display: 'flex' }}>
            {timeSince(new Date(verification.modified.$date))}
            <li
              style={{
                color: getStatusColor(verification.status),
                marginLeft: ' 20px'
              }}
            >
              {verification.status}
            </li>
          </p>
        </Title>
        <div style={{ cursor: 'pointer' }} onClick={closeModal}>
          <CloseIcon />
        </div>
      </RowHeader>
      <RowContainer>
        <ProfileContent>
          <Avatar did={verification.from_did} />
          <p className="mb-2 name">{user.name}</p>
          <DidSnippet
            did={user.did}
            dateJoined={user.timestamp}
            width={'200px'}
          />

          <Link
            className="mt-2"
            to={getDIDString('/did/' + user.did)}
            target="_blank"
          >
            View Profile
          </Link>
        </ProfileContent>

        <ContentArea>
          <h4 className="mt-4">Verification Details</h4>
          <Expander
            title={getCategoryTitle(verification)}
            categories={records}
          />
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
      <RowFooter>
        {verification.status === 'requested' && (
          <div className="buttons">
            <StyledButton
              width={'102px'}
              height={'36px'}
              bgColor={'#fff4f4'}
              color={'#ff5a5a'}
              className={'mr-3'}
              onClick={async () => await handleAction(false)}
            >
              Reject{loading === 2 ? 'ing' : ''}
            </StyledButton>
            <StyledButton
              width={'182px'}
              height={'36px'}
              onClick={async () => await handleAction(true)}
            >
              {loading === 1
                ? 'Please approve request on Essentials App'
                : 'Approve Verification'}
            </StyledButton>
          </div>
        )}
      </RowFooter>
    </>
  );
};

export default VerificationDetailContent;
