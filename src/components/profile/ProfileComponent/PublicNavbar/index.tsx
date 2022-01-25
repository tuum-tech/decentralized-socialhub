import { IonRow, IonCol } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import React from 'react';
import styled from 'styled-components';

import { DashboardSignInButton } from 'src/elements/buttons';

const PublicNavbarContainer = styled(IonRow)`
  width: 100%;
  height: 83px;
  padding: 0 32px;
  background-color: #ffffff;
  z-index: 1001;
  align-items: center;
`;

const RegisterButton = styled(DashboardSignInButton)`
  margin-right: 14px;
  background: #f3f9ff;
  color: #4c6fff;
`;

const SignButton = styled(DashboardSignInButton)``;

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
        <img alt="profile logo" src="../../../assets/logo_profile_black.svg" />
      </IonCol>
      <IonCol size="auto">
        {!signedIn && (
          <IonRow>
            <IonCol>
              <RegisterButton href="/create-profile">
                Register new user
              </RegisterButton>
            </IonCol>
            <IonCol>
              <SignButton href="/sign-in">Sign In</SignButton>
            </IonCol>
          </IonRow>
        )}
      </IonCol>
    </PublicNavbarContainer>
  );
};

export default PublicNavbar;
