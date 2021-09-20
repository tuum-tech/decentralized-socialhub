import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';

import Expander from 'src/elements/Expander';
import { timeSince } from 'src/utils/time';
import { getStatusColor } from './UserRows';

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
  --height: 678px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  verification: VerificationRequest;
  user: ISessionItem;
  approvable?: boolean;
}

const VerificationDetailContent = ({ verification, user }: Props) => {
  const { category, records } = verification;

  return (
    <Container>
      <p>
        Verificaiton Request Sent To <InfoTxt>{verification.to_did}</InfoTxt>
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

      <InfoTxt className="mt-4 mb-2">Message I sent</InfoTxt>
      <p>{verification.msg}</p>

      {verification.feedbacks && verification.feedbacks !== '' && (
        <>
          <InfoTxt className="mt-4 mb-2">Feedbacks I received</InfoTxt>
          <p>{verification.feedbacks || ''}</p>
        </>
      )}
    </Container>
  );
};

export default VerificationDetailContent;
