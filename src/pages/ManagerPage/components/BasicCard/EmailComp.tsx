import React, { useState } from 'react';
import styled from 'styled-components';
import { IonRow, IonCol } from '@ionic/react';

import { Text16 } from 'src/elements/texts';
import { SmallLightButton } from 'src/elements/buttons';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';

import EmailVerificationDetailContent, {
  EmailVerificationDetailModal
} from 'src/components/Auth/Email';
import { requestUpdateEmail } from 'src/components/Auth/fetchapi';

import { validateEmail } from 'src/utils/validation';

export const ActionBtnCol = styled(IonCol)`
  margin: 0 0 0 auto;
`;

export const Container = styled(IonRow)`
  input[type='number']::-webkit-inner-spin-button,
  input[type='number']::-webkit-outer-spin-button {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0;
  }
`;

export const ErrorText = styled(Text16)`
  text-align: left;
  color: red;
  margin-top: 8px;
`;

interface Props {
  emailUpdated: (email: string) => void;
  sessionItem: ISessionItem;
}

const UpdateEmailComp: React.FC<Props> = ({ emailUpdated, sessionItem }) => {
  const [showEmailVerifyModal, setShowEmailVerifyModal] = useState(false);
  const [email, setEmail] = useState(sessionItem.loginCred?.email || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEmailValid = () => {
    if (sessionItem.tutorialStep !== 4) return true;
    if (loading) return true;
    if (email === '') return true;
    if (sessionItem.loginCred?.email && email === sessionItem.loginCred?.email)
      return true;
    return !validateEmail(email);
  };

  const checkError = (e: string) => {
    if (e === '') {
      setError('');
    } else if (e === sessionItem.loginCred?.email) {
      setError('Same Email');
    } else if (!validateEmail(e)) {
      setError('Invalid Email');
    } else {
      setError('');
    }
  };

  const sendVerification = async () => {
    setLoading(true);

    let response = (await requestUpdateEmail(
      sessionItem.did,
      email,
      sessionItem.phone || ''
    )) as IUpdateEmailResponse;

    if (response && response.data && response.data.status === 'success') {
      if (!showEmailVerifyModal) {
        setShowEmailVerifyModal(true);
      }
    } else {
      setError('Failed to send verification');
    }

    setLoading(false);
  };

  return (
    <Container class="ion-justify-content-start">
      <IonCol size="5">
        <SmallTextInput
          disabled={sessionItem.tutorialStep !== 4 || loading}
          label="Email"
          placeholder={sessionItem.loginCred?.email}
          name="email"
          value={email}
          onChange={(evt: any) => {
            setEmail(evt.target.value);
            checkError(evt.target.value);
          }}
        />
        {error !== '' && <ErrorText>{error}</ErrorText>}
      </IonCol>
      <ActionBtnCol size="auto">
        <SmallLightButton
          disabled={!isEmailValid()}
          onClick={async () => {
            await sendVerification();
          }}
        >
          {loading ? 'Sending Verificaiton' : 'Send Verificaiton'}
        </SmallLightButton>
      </ActionBtnCol>

      <EmailVerificationDetailModal
        isOpen={showEmailVerifyModal}
        backdropDismiss={false}
      >
        <EmailVerificationDetailContent
          close={() => setShowEmailVerifyModal(false)}
          email={email}
          resend={sendVerification}
          afterVerified={() => {
            setShowEmailVerifyModal(false);
            emailUpdated(email);
          }}
        />
      </EmailVerificationDetailModal>
    </Container>
  );
};

export default UpdateEmailComp;
