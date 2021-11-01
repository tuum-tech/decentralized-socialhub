import React, { useState } from 'react';
import styled from 'styled-components';
import { IonTextarea, IonModal } from '@ionic/react';
import { Link } from 'react-router-dom';

import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { EssentialsService } from 'src/services/essentials.service';

import { SmallLightButton } from 'src/elements/buttons';
import Expander from 'src/elements/Expander';
import DidSnippet from 'src/elements/DidSnippet';
import Avatar from 'src/components/Avatar';

import { InfoTxt, Container } from '../MyRequests/VerificationDetail';
import { getStatusColor } from '../MyRequests/UserRows';

import { VerificationService } from 'src/services/verification.service';

import { timeSince } from 'src/utils/time';
import { getDIDString } from 'src/utils/did';
import { getCategoryTitle } from 'src/utils/credential';

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
    const vc = await vService.approveCredential(
      session,
      verification,
      approve,
      feedbacks
    );
    if (vc) {
      let didService = await DidService.getInstance();
      let userService = new UserService(didService);
      let reqSenderDID = verification.from_did;
      let reqSender = await userService.SearchUserWithDID(reqSenderDID);
      let didDocumentWithVRC: DIDDocument;
      let didDocument: DIDDocument = await didService.getStoredDocument(
        new DID(reqSenderDID)
      );
      if (reqSender.isEssentialUser) {
        // let essentialsService = new EssentialsService(didService);
        // await essentialsService.addVerifiableCredentialEssentials(vc);
        // didDocumentWithVRC = await didService.getPublishedDocument(
        //   new DID(reqSenderDID)
        // );
        didDocumentWithVRC = await didService.addVerifiableCredentialToEssentialsDIDDocument(
          didDocument,
          vc
        );
      } else {
        didDocumentWithVRC = await didService.addVerifiableCredentialToDIDDocument(
          didDocument,
          vc
        );
      }
      await didService.storeDocument(didDocumentWithVRC);
    }
    setLoading(0);
    closeModal();
  };

  return (
    <RowContainer>
      <ProfileContent>
        <Avatar did={verification.from_did} />
        <p className="mb-2 name">{user.name}</p>
        <DidSnippet did={user.did} />

        <Link
          className="mt-2"
          to={getDIDString('/did/' + user.did)}
          target="_blank"
        >
          View Profile
        </Link>
      </ProfileContent>

      <ContentArea>
        <p className="bottom mt-4" style={{ display: 'flex' }}>
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

        <Expander
          title={getCategoryTitle(verification)}
          cateogiries={records}
        />
        {verification.status === 'requested' && (
          <div className="buttons">
            <SmallLightButton onClick={async () => await handleAction(true)}>
              {loading === 1 ? 'Approving' : 'Approve'}
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
