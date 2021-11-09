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
import { requestEmailVerifyCode } from '../fetchapi';

export const EmailVerificationDetailModal = styled(IonModal)`
  --border-radius: 16px;
  --width: 587px;
  --height: 295px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

interface Props {
  email: string;
  close: () => void;
  resend: () => void;
  afterVerified?: () => void;
}

const EmailVerificationDetailContent: React.FC<Props> = ({
  email,
  close,
  resend,
  afterVerified
}) => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [afterSuccess, setAfterSucess] = useState(0);
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
    let response = (await requestEmailVerifyCode(code)) as IVerifyCodeResponse;
    if (response.data.return_code === 'CODE_CONFIRMED') {
      const { name, email, did } = response.data;
      setCredentials({
        did,
        name,
        loginCred: {
          email
        },
        credential: code
      });
    }

    let status = response.data.return_code;
    if (status === 'CODE_CONFIRMED') {
      if (afterVerified) {
        afterVerified();
      } else if (credentials.did && credentials.did.length > 0) {
        setAfterSucess(1);
      } else {
        setAfterSucess(2);
      }
    } else {
      setError('Invalid Code !');
    }
    setLoading(false);
  };

  if (afterSuccess === 1) {
    return (
      <Redirect
        to={{
          pathname: '/generate-did',
          state: {
            did: credentials.did,
            name: credentials.name,
            loginCred: {
              email: credentials.loginCred.email
            },
            service: AccountType.DID,
            credential: credentials.credential
          }
        }}
      />
    );
  } else if (afterSuccess === 2) {
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

export default EmailVerificationDetailContent;
