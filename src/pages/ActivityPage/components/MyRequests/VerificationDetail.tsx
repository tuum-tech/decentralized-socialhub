import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';
import { down } from 'styled-breakpoints';

import Expander from 'src/elements/Expander';
import { timeSince } from 'src/utils/time';
import { getStatusColor } from '../common';
import { VerificationService } from 'src/services/verification.service';
import { getCategoryTitle } from 'src/utils/credential';
import { DefaultButton } from 'src/elements-v2/buttons';

export const InfoTxt = styled.span`
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: #425466;
  padding: 5px 7px;
`;

export const InfoMessage = styled.p`
  display: flex;
  flex-direction: row;
  padding: 5px 7px;
  min-height: 56px;
  background: #edf2f7;
  border-radius: 8px;
  margin-top: 5px;
  color: #425466;
  font-size: 14px;
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

export const Title = styled.div`
  h4 {
    font-size: 28px;
    font-weight: 600;
    line-height: 136.02%;
  }
`;

const RowContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  padding: 0px 40px;
  margin: 40px 0px;
  ${down('sm')} {
    flex-direction: column;
    padding: 0px 20px;
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
  const [loading, setLoading] = useState(false);
  const { records } = verification;

  return (
    <RowContainer>
      <div>
        <Title>
          <h4>
            Verification Request Sent To <InfoTxt>{user.name}</InfoTxt>
          </h4>
        </Title>

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

        <Expander title={getCategoryTitle(verification)} categories={records} />

        {verification.msg && verification.msg !== '' && (
          <div className="mt-4 mb-2">
            <InfoTxt>Message</InfoTxt>
            <InfoMessage>{verification.msg}</InfoMessage>
          </div>
        )}

        {verification.feedbacks && verification.feedbacks !== '' && (
          <div className="mt-4 mb-2">
            <InfoTxt>Feedbacks</InfoTxt>
            <InfoMessage>{verification.feedbacks || ''}</InfoMessage>
          </div>
        )}
      </div>
      {verification.status === 'approved' && (
        <DefaultButton
          variant="contained"
          btnColor="primary-gradient"
          size="large"
          style={{ textAlign: 'center', width: '100%' }}
          disabled={loading}
          onClick={async () => {
            setLoading(true);
            const vService = new VerificationService();
            await vService.storeNewCredential(verification, user);
            setLoading(false);
            onClose();
          }}
        >
          {loading
            ? 'Approve Credential Import on Essentials App'
            : 'Save signed Credential'}
        </DefaultButton>
      )}
    </RowContainer>
  );
};

export default VerificationDetailContent;
