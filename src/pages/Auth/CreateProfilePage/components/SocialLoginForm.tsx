import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import { ThemeButton } from 'src/elements/buttons';
import TextInput from 'src/elements/inputs/TextInput';
import { Text16 } from 'src/elements/texts';

import { useHistory } from 'react-router-dom';

import { useMoralis } from 'react-moralis';

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

interface Props {}

const SocialLoginForm: React.FC<Props> = () => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [displayText, setDisplayText] = useState('');
  const [loading, setLoading] = useState(false);

  const { Moralis, authenticate, isAuthenticated, user } = useMoralis();

  const history = useHistory();

  const handleWeb3AuthLogin = async () => {
    if (!name) {
      setError('You should fill out your name');
      return;
    } else {
      setError('');
    }

    console.log('isAuthenticated:', isAuthenticated);

    setLoading(true);
    setDisplayText('Authenticating');

    if (!isAuthenticated) {
      let authResponse = await authenticate({
        provider: 'web3Auth',
        clientId: process.env.REACT_APP_WEB3AUTH_CLIENTID,
        loginMethodsOrder: [
          'google',
          'facebook',
          'twitter',
          'linkedin',
          'github',
          'reddit',
          'discord',
          'twitch',
          'apple',
          'line',
          'kakao',
          'weibo',
          'wechat',
          'email_passwordless'
        ],
        theme: 'light'
      });
      Moralis.User.become(authResponse?.attributes.sessionToken).then(
        function(u) {
          console.log('User is now logged in: ', u.attributes);

          history.push({
            pathname: '/generate-did',
            state: {
              name: name,
              userAttributes: u.attributes
            }
          });
        },
        function(error: any) {
          console.log('User could not log in: ', error.toString());
          setError(error.toString());
          setLoading(false);
        }
      );
    } else {
      console.log('User is already logged in: ', user?.attributes);
      if (user) {
        history.push({
          pathname: '/generate-did',
          state: {
            name: name,
            userAttributes: user.attributes
          }
        });
      }
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
            onChange={n => setName(n)}
            placeholder="Enter your Full name"
            hasError={error !== '' && name === ''}
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
              await handleWeb3AuthLogin();
            }}
          />
        </IonCol>
      </IonRow>
    </Container>
  );
};

export default SocialLoginForm;
