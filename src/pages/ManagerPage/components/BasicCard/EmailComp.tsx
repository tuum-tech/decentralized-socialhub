import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { IonRow, IonCol } from '@ionic/react';
import { down } from 'styled-breakpoints';

import { SmallLightButton } from 'src/elements/buttons';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';

import EmailVerificationDetailContent, {
  EmailVerificationDetailModal
} from 'src/components/Auth/Email';
import { requestUpdateEmailOrPhone } from 'src/components/Auth/fetchapi';

import { validateEmail } from 'src/utils/validation';
import { DefaultButton } from 'src/elements-v2/buttons';
import { ErrorText } from 'src/elements/texts';

export const ActionBtnCol = styled(IonCol)`
  margin: 0 0 0 auto;
  display: flex;
  align-items: flex-end;
  ${down('sm')} {
    margin-top: 12px;
  }
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

export const SaveButton = styled(SmallLightButton)<{ disabled: boolean }>`
  margin-left: 10px;
  color: ${props => {
    return props.disabled ? '#6B829A' : '#4c6fff';
  }};
`;

interface Props {
  emailUpdated: (email: string) => void;
  sessionItem: ISessionItem;
  isEdit?: boolean;
}

const EmailComp: React.FC<Props> = ({
  emailUpdated,
  sessionItem,
  isEdit = false
}) => {
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

  const isDisabled = useMemo(() => {
    return (
      sessionItem.tutorialStep !== 4 ||
      loading ||
      error !== '' ||
      email === sessionItem.loginCred?.email ||
      email === ''
    );
  }, [sessionItem, loading, error, email]);

  return (
    <Container class="ion-justify-content-start">
      <IonRow style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
        <IonCol sizeXs="12" sizeSm="5">
          <SmallTextInput
            disabled={sessionItem.tutorialStep !== 4 || loading || !isEdit}
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
        {!isEdit && (
          <ActionBtnCol size="auto">
            <DefaultButton
              className="mr-2"
              size="small"
              variant="outlined"
              btnColor="primary-gradient"
              textType="gradient"
              disabled={isDisabled}
              onClick={async () => {
                await sendVerification();
              }}
            >
              {loading ? 'Sending Verification' : 'Send Verification'}
            </DefaultButton>
          </ActionBtnCol>
        )}
      </IonRow>

      {error !== '' && (
        <IonRow style={{ width: '100%' }}>
          <IonCol size="12" style={{ paddingTop: 0 }}>
            <ErrorText position="relative">{error}</ErrorText>
          </IonCol>
        </IonRow>
      )}

      <EmailVerificationDetailModal
        isOpen={showEmailVerifyModal}
        backdropDismiss={false}
      >
        <EmailVerificationDetailContent
          did={sessionItem.did}
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

export default EmailComp;
