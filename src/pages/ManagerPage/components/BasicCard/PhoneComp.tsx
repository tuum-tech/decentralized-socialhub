import React, { useState } from 'react';
import { IonCol } from '@ionic/react';
import { isValidPhoneNumber } from 'react-phone-number-input';

import { SmallLightButton } from 'src/elements/buttons';
import SmallTextInput from 'src/elements/inputs/SmallTextInput';

import PhoneVerificationDetailContent, {
  PhoneVerificationDetailModal
} from 'src/components/Auth/Phone';
import { updatePhoneNumber } from 'src/components/Auth/fetchapi';

import { ActionBtnCol, Container, ErrorText } from './EmailComp';

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

    let response = (await updatePhoneNumber(
      sessionItem.did,
      sessionItem.loginCred?.phone || '',
      phone
    )) as IUpdateEmailResponse;

    console.log('====>', response.data.status);
    if (response && response.data && response.data.status === 'success') {
      if (!showPhoneVerifyModal) {
        setShowPhoneVerifyModal(true);
      }
    } else {
      setError('Failed to send verification');
    }

    setLoading(false);
  };

  const isPhoneInvalid = () => {
    if (sessionItem.tutorialStep !== 4) return true;
    if (loading) return true;
    if (phone === '') return true;
    if (sessionItem.loginCred?.phone && phone === sessionItem.loginCred?.phone)
      return true;
    return !isValidPhoneNumber(phone);
  };

  const checkError = (p: string) => {
    if (p === '') {
      setError('');
    } else if (p === sessionItem.loginCred?.phone) {
      setError('Same Phone');
    } else if (!isValidPhoneNumber(p)) {
      setError('Invalid Phone');
    }
  };

  return (
    <Container class="ion-justify-content-start">
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
        {error !== '' && <ErrorText>{error}</ErrorText>}
      </IonCol>
      <ActionBtnCol size="auto">
        <SmallLightButton
          disabled={isPhoneInvalid()}
          onClick={async () => {
            await sendVerification();
          }}
        >
          Send Verification
        </SmallLightButton>
      </ActionBtnCol>

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
