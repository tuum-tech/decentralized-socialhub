import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';

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
  onClose: () => void;
}

const VerificationDetailContent = ({ verification, user, onClose }: Props) => {
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
          onClick={() => {
            onClose();
          }}
        >
          Save signed credential
        </BlueButton>
      )}
    </Container>
  );
};

export default VerificationDetailContent;
