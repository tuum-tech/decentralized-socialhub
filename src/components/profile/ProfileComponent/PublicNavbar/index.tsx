import { IonRow, IonCol } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

import { DefaultButton } from 'src/elements-v2/buttons';
import logo from 'src/assets/new/logo.svg';

const PublicNavbarContainer = styled(IonRow)`
  width: 100%;
  height: 83px;
  padding: 0 32px;
  background-color: #ffffff;
  z-index: 1001;
  align-items: center;

  img {
    width: 77px;
    margin-left: 15px;
  }
`;

interface Props {
  signedIn: boolean;
}

const PublicNavbar: React.FC<Props> = ({ signedIn }) => {
  const history = useHistory();
  return (
    <PublicNavbarContainer className="ion-justify-content-between">
      <IonCol
        size="auto"
        onClick={() => {
          history.push('/profile');
        }}
        style={{
          cursor: 'pointer'
        }}
      >
        <img alt="profile logo" src={logo} />
      </IonCol>
      <IonCol size="auto">
        {!signedIn && (
          <IonRow>
            <DefaultButton
              variant="outlined"
              btnColor="primary-gradient"
              textType="gradient"
              onClick={() => {
                history.push('/create-profile');
              }}
            >
              Register new user
            </DefaultButton>
            <DefaultButton
              variant="contained"
              btnColor="primary-gradient"
              className="ml-3"
              onClick={() => {
                history.push('/sign-in');
              }}
            >
              Sign in
            </DefaultButton>
          </IonRow>
        )}
      </IonCol>
    </PublicNavbarContainer>
  );
};

export default PublicNavbar;
