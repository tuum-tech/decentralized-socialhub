import React, { useState } from 'react';
import styled from 'styled-components';
import { IonRow, IonCol } from '@ionic/react';

import { Text16 } from 'src/elements/texts';
import { SmallLightButton } from 'src/elements/buttons';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';

import EmailVerificationDetailContent, {
  EmailVerificationDetailModal
} from 'src/components/Auth/Email';
import { requestUpdateEmailOrPhone } from 'src/components/Auth/fetchapi';

import { validateEmail } from 'src/utils/validation';

export const ActionBtnCol = styled(IonCol)`
  margin: 0 0 0 auto;
  display: flex;
  align-items: flex-end;
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
  margin-top: 0;
`;

export const SaveButton = styled(SmallLightButton)<{ disabled: boolean }>`
  margin-left: 10px;
  color: ${props => {
    return props.disabled ? '#6B829A' : '#4c6fff';
  }};
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

  const checkError = (newEmail: string) => {
    if (newEmail === '') {
      setError('No Email');
    } else if (newEmail === sessionItem.loginCred?.email) {
      setError('Same Email');
    } else if (!validateEmail(newEmail)) {
      setError('Invalid Email');
    } else {
      setError('');
    }
  };

  const sendVerification = async () => {
    setLoading(true);

    let response = (await requestUpdateEmailOrPhone(
      sessionItem.did,
      email,
      sessionItem.loginCred?.phone || ''
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

  const disableButton = () => {
    return (
      sessionItem.tutorialStep !== 4 ||
      loading ||
      error !== '' ||
      email === sessionItem.loginCred?.email ||
      email === ''
    );
  };

  return (
    <Container class="ion-justify-content-start">
      <IonRow style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
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
        </IonCol>
        <ActionBtnCol size="auto">
          <SaveButton
            disabled={disableButton()}
            onClick={async () => {
              await sendVerification();
            }}
          >
            {loading ? 'Sending Verification' : 'Send Verification'}
          </SaveButton>
        </ActionBtnCol>
      </IonRow>

      {error !== '' && (
        <IonRow style={{ width: '100%' }}>
          <IonCol size="12" style={{ paddingTop: 0 }}>
            <ErrorText>{error}</ErrorText>
          </IonCol>
        </IonRow>
      )}

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
