import React, { useState } from 'react';
import styled from 'styled-components';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { ThemeButton } from 'src/elements/buttons';
import TextInput from 'src/elements/inputs/TextInput';

import { validateEmail } from 'src/utils/validation';
import { requestCreateEmailUser } from 'src/components/Auth/fetchapi';
import { Text16 } from 'src/elements/texts';

const Container = styled(IonGrid)`
  margin-left: -16px;
  margin-right: -16px;
  padding: 0;
  display: block;
`;

const ErrorText = styled(Text16)`
  text-align: center;
  color: red;
  margin-top: 8px;
`;

const DisplayText = styled(Text16)`
  text-align: center;
  color: green;
  margin-top: 8px;
`;

interface Props {
  onSuccess: (name: string, eamil: string, password: string) => void;
}

const EmailUserCreate: React.FC<Props> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const [loading, setLoading] = useState(false);
  const [displayText, setDisplayText] = useState('');

  const validatePassword = (n: string): any => {
    if (n.length <= 8) {
      setError('Password: Should be 8+ characters');
      return false;
    }

    if (!/[A-Z]/.test(n)) {
      setError('Password: No Uppercase');
      return false;
    }

    if (!/[a-z]/.test(n)) {
      setError('Password: No Lowercase');
      return false;
    }

    if (!/[0-9]/.test(n)) {
      setError('Password: No Number');
      return false;
    }

    if (!/[ `!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/.test(n)) {
      setError('Password: No Special Character');
      return false;
    }

    return true;
  };

  const setField = (fieldName: string, fieldValue: string) => {
    setError('');
    setDisplayText('');
    if (fieldName === 'name') setName(fieldValue);
    if (fieldName === 'email') setEmail(fieldValue);
    if (fieldName === 'password') setPassword(fieldValue);
    if (fieldName === 'repassword') setRePassword(fieldValue);
  };

  const createUser = async () => {
    if (!name || !email || !password || !repassword) {
      setError('You should fill all fields');
      return;
    }
    if (!validateEmail(email)) {
      setError('Not correct Email');
      return;
    }
    if (password !== repassword) {
      setError('Password Not Match');
      return;
    }

    if (!validatePassword(password)) {
      return;
    }

    setLoading(true);
    let response = (await requestCreateEmailUser(
      name,
      email,
      'temporary_' + name + email
    )) as ICreateUserResponse;

    if (
      response &&
      response.data &&
      response.data.return_code === 'WAITING_CONFIRMATION'
    ) {
      onSuccess(name, email, password);
    } else {
      setError('An error happened when creating user.');
    }
    setLoading(false);
  };

  return (
    <Container>
      <IonRow class="ion-padding-horizontal">
        <IonCol>
          <TextInput
            value={name}
            label="Name"
            onChange={n => setField('name', n)}
            placeholder="Enter your Full name"
            hasError={error !== '' && name === ''}
          />
        </IonCol>
      </IonRow>

      <IonRow class="ion-padding-horizontal">
        <IonCol>
          <TextInput
            value={email}
            label="E-mail"
            onChange={n => setField('email', n)}
            placeholder="Enter your e-mail"
            hasError={error !== '' && email === ''}
            type="email"
          />
        </IonCol>
      </IonRow>

      <IonRow>
        <IonCol class="ion-padding-horizontal">
          <TextInput
            value={password}
            label="Password"
            onChange={n => {
              validatePassword(n);
              setField('password', n);
            }}
            placeholder="Enter your password"
            hasError={error !== '' && password === ''}
            type="password"
          />
        </IonCol>

        <IonCol class="ion-padding-horizontal">
          <TextInput
            value={repassword}
            label="Retype Password"
            onChange={n => setField('repassword', n)}
            placeholder="ReEnter your password"
            hasError={error !== '' && repassword === ''}
            type="password"
          />
        </IonCol>
      </IonRow>

      <IonRow class="ion-padding-horizontal">
        <IonCol>
          {error !== '' && <ErrorText>{error}</ErrorText>}
          {displayText !== '' && <DisplayText>{displayText}</DisplayText>}
        </IonCol>
      </IonRow>

      <IonRow class="ion-padding-horizontal">
        <IonCol>
          <ThemeButton
            style={{
              marginTop: '35px'
            }}
            text={loading ? 'Creating your profile now' : 'Create new Profile'}
            onClick={async () => {
              await createUser();
            }}
          />
        </IonCol>
      </IonRow>
    </Container>
  );
};

export default EmailUserCreate;
