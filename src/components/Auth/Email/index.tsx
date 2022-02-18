import React, { useState } from 'react';
import styled from 'styled-components';
import { IonModal } from '@ionic/react';
import { Redirect } from 'react-router-dom';

import {
  Container,
  VerifyButton,
  CancelButton,
  CodeInput
} from '../components';
import { AccountType } from 'src/services/user.service';
import { requestVerifyCode } from '../fetchapi';

export const EmailVerificationDetailModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 587px;
  --height: 295px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  did: string;
  email: string;
  close: () => void;
  resend: () => void;
  afterVerified?: () => void;
}

const EmailVerificationDetailContent: React.FC<Props> = ({
  did,
  email,
  close,
  resend,
  afterVerified
}) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [afterSuccess, setAfterSucess] = useState(false);
  const [credentials, setCredentials] = useState({
    did: '',
    loginCred: {
      email: ''
    },
    name: '',
    credential: ''
  });

  const verify = async () => {
    setLoading(true);
    let response = (await requestVerifyCode(
      code,
      email,
      ''
    )) as IVerifyCodeResponse;

    console.log('=====>response', response);
    let status = response.data.return_code;
    if (status === 'CONFIRMED') {
      const { name, email, did } = response.data;
      let cred = {
        did,
        name,
        loginCred: {
          email
        },
        credential: code
      };
      setCredentials(cred);
      if (afterVerified) {
        afterVerified();
      } else if (cred.did && cred.did.length > 0) {
        setAfterSucess(true);
      }
    } else {
      setError('Invalid Code !');
    }
    setLoading(false);
  };

  if (afterSuccess) {
    return (
      <Redirect
        to={{
          pathname: '/generate-did',
          state: {
            name: credentials.name,
            did: '',
            loginCred: {
              email: credentials.loginCred.email
            },
            service: AccountType.Email,
            AccountType: AccountType.Email,
            credential: credentials.credential
          }
        }}
      />
    );
  }

  return (
    <Container>
      <p className="title">Email Verification</p>
      <p className="intro">
        Check your inbox. we sent you a verification code to {email}
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
        Didn’t receive the code?
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

export default EmailVerificationDetailContent;
