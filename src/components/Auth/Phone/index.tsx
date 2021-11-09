import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';

import {
  Container,
  VerifyButton,
  CancelButton,
  CodeInput
} from '../components';
import { verifyPhoneCode } from '../fetchapi';

export const PhoneVerificationDetailModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 587px;
  --height: 295px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  did: string;
  phone: string;
  close: () => void;
  resend: () => void;
  afterVerified: () => void;
}

const PhoneVerificationDetailContent: React.FC<Props> = ({
  did,
  phone,
  close,
  resend,
  afterVerified
}) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const verify = async () => {
    setLoading(true);
    const verifyCodeRes = (await verifyPhoneCode(
      code,
      did,
      phone
    )) as IVerifyCodeResponse;
    setLoading(false);

    if (
      verifyCodeRes &&
      verifyCodeRes.data &&
      verifyCodeRes.data.return_code === 'CODE_CONFIRMED'
    ) {
      afterVerified();
    } else {
      setError('Invalid SMS code');
    }
  };

  return (
    <Container>
      <p className="title">Phone Verification</p>
      <p className="intro">
        Check your Phone. we sent you a verification code to {phone}
      </p>
      <p className="label">Enter 6-digit code</p>
      <div className="input-area">
        <CodeInput
          hasError={error !== ''}
          value={code}
          onIonChange={e => {
            setError('');
            e.preventDefault();
            setCode(e.detail.value!);
          }}
          placeholder="Enter verification code here"
        />
        {error !== '' && <p className="error">{error}</p>}
      </div>

      <p className="below">
        Didn’t recieve the code?
        <button className="button" onClick={resend}>
          Resend code
        </button>
      </p>
      <div className="buttons">
        <CancelButton disabled={loading} onClick={close}>
          Cancel
        </CancelButton>
        <VerifyButton disabled={code === '' || loading} onClick={verify}>
          {loading ? 'Verifying Now' : 'Verify'}
        </VerifyButton>
      </div>
    </Container>
  );
};

export default PhoneVerificationDetailContent;
