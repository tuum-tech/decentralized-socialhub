import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';

import { DidService } from 'src/services/did.service.new';
import { DIDDocument, DID } from '@elastosfoundation/did-js-sdk/';
import { TuumTechScriptService } from 'src/services/script.service';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';

import Expander from 'src/elements/Expander';
import { timeSince } from 'src/utils/time';
import { getStatusColor } from './UserRows';
import { BlueButton } from './SentModal';

export const InfoTxt = styled.span`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #425466;
`;

export const Container = styled.div`
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

export const VerificationDetailModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 670px;
  --height: 578px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  verification: VerificationRequest;
  user: ISessionItem;
  me: ISessionItem;
  onClose: () => void;
}

const VerificationDetailContent = ({
  verification,
  user,
  me,
  onClose
}: Props) => {
  const [loading, setLoading] = useState(false);
  const { category, records } = verification;

  return (
    <Container
      style={{
        display: 'flex',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <p>
          Verificaiton Request Sent To <InfoTxt>{user.name}</InfoTxt>
        </p>

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

        {verification.msg && verification.msg !== '' && (
          <div className="mt-4 mb-2">
            <InfoTxt>Message</InfoTxt>
            <p>{verification.msg}</p>
          </div>
        )}

        {verification.feedbacks && verification.feedbacks !== '' && (
          <div className="mt-4 mb-2">
            <InfoTxt>Feedbacks</InfoTxt>
            <p>{verification.feedbacks || ''}</p>
          </div>
        )}
      </div>
      {verification.status === 'approved' && (
        <BlueButton
          style={{ textAlign: 'center' }}
          disabled={loading}
          onClick={async () => {
            setLoading(true);

            // format data
            let category = 'PersonalInfo';
            if (verification.category.startsWith('Education: ')) {
              category = 'Education';
            } else if (verification.category.startsWith('Experience: ')) {
              category = 'Experience';
            }
            const content =
              verification.category +
              '***' +
              `Verified_By_${user.name}(${user.did})`;

            // // publish this verified credential into didDocument
            let didService = await DidService.getInstance();
            let verifiableCredential = await DidcredsService.generateVerifiableCredential(
              me.did,
              category as CredentialType,
              content
            );

            let didDocument: DIDDocument = await didService.getStoredDocument(
              new DID(me.did)
            );
            let documentWithCredential = await didService.addVerifiableCredentialToDIDDocument(
              didDocument,
              verifiableCredential
            );

            await didService.storeDocument(documentWithCredential);
            await didService.publishDocument(documentWithCredential);

            // update tuum.tech vault
            const res = await TuumTechScriptService.updateVerificationRequest(
              verification.from_did,
              verification.to_did,
              verification.updated_at.toString(),
              'Approved & Published',
              verification.category,
              verification.msg,
              verification.feedbacks
            );
            console.log(res);
            setLoading(false);
            onClose();
          }}
        >
          {loading ? 'Saving Now' : 'Save signed Credential'}
        </BlueButton>
      )}
    </Container>
  );
};

export default VerificationDetailContent;
