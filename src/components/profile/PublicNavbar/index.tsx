import { IonRow, IonCol } from '@ionic/react';
import React from 'react';
import styled from 'styled-components';

import { DashboardSignInButton } from 'src/components/buttons';

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
  return (
    <PublicNavbarContainer className="ion-justify-content-between">
      <IonCol size="auto">
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
              <SignButton href="/sign-did">Sign In</SignButton>
            </IonCol>
          </IonRow>
        )}
      </IonCol>
    </PublicNavbarContainer>
  );
};

export default PublicNavbar;
