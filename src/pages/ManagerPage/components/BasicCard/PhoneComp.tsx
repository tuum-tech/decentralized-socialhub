import React, { useState } from 'react';
import { IonCol, IonRow } from '@ionic/react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import SmallTextInput from 'src/elements/inputs/SmallTextInput';

import PhoneVerificationDetailContent, {
  PhoneVerificationDetailModal
} from 'src/components/Auth/Phone';

import { requestUpdateEmailOrPhone } from 'src/components/Auth/fetchapi';

import { ActionBtnCol, Container, ErrorText, SaveButton } from './EmailComp';

interface Props {
  phoneUpdated: (phone: string) => void;
  sessionItem: ISessionItem;
}

const UpdatePhoneComp: React.FC<Props> = ({ phoneUpdated, sessionItem }) => {
  const [showPhoneVerifyModal, setShowPhoneVerifyModal] = useState(false);
  const [phone, setPhone] = useState(sessionItem.loginCred?.phone || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const sendVerification = async () => {
    setLoading(true);

    let response = (await requestUpdateEmailOrPhone(
      sessionItem.did,
      sessionItem.loginCred?.email || '',
      phone
    )) as IUpdateEmailResponse;

    if (response && response.data && response.data.status === 'success') {
      if (!showPhoneVerifyModal) {
        setShowPhoneVerifyModal(true);
      }
    } else {
      setError('Failed to send verification');
    }

    setLoading(false);
  };

  const checkError = (newPhone: string) => {
    if (newPhone === '') {
      setError('No Phone');
    } else if (newPhone === sessionItem.loginCred?.phone) {
      setError('Same Phone');
    } else if (!isValidPhoneNumber(newPhone)) {
      setError('Invalid Phone');
    } else {
      setError('');
    }
  };

  const disableButton = () => {
    return (
      sessionItem.tutorialStep !== 4 ||
      loading ||
      error !== '' ||
      phone === sessionItem.loginCred?.phone ||
      phone === ''
    );
  };

  return (
    <Container class="ion-justify-content-start">
      <IonRow style={{ width: '100%', paddingLeft: 0, paddingRight: 0 }}>
        <IonCol size="5">
          <SmallTextInput
            disabled={sessionItem.tutorialStep !== 4 || loading}
            label="Phone Number"
            placeholder="+79149625769"
            name="phoneNumber"
            value={phone}
            onChange={(evt: any) => {
              setPhone(evt.target.value);
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
          <SaveButton
            disabled={phone === ''}
            onClick={() => {
              setPhone('');
              phoneUpdated('');
            }}
          >
            Clear
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

      <PhoneVerificationDetailModal
        isOpen={showPhoneVerifyModal}
        backdropDismiss={false}
      >
        <PhoneVerificationDetailContent
          close={() => setShowPhoneVerifyModal(false)}
          phone={phone}
          did={sessionItem.did}
          resend={sendVerification}
          afterVerified={() => {
            setShowPhoneVerifyModal(false);
            phoneUpdated(phone);
          }}
        />
      </PhoneVerificationDetailModal>
    </Container>
  );
};

export default UpdatePhoneComp;
