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

interface Props {
  signedIn: boolean;
}

const PublicNavbar: React.FC<Props> = ({ signedIn }) => {
  return (
    <PublicNavbarContainer className="ion-justify-content-between">
      <IonCol size="auto">
        <img src="../../../assets/logo_profile_black.svg" />
      </IonCol>
      <IonCol size="auto">
        {!signedIn && (
          <IonRow className="ion-no-padding">
            <IonCol>
              <DashboardSignInButton href="/create-profile">
                Register new user
              </DashboardSignInButton>
            </IonCol>
            <IonCol>
              <DashboardSignInButton href="/sign-did">
                Sign In
              </DashboardSignInButton>
            </IonCol>
          </IonRow>
        )}
      </IonCol>
    </PublicNavbarContainer>
  );
};

export default PublicNavbar;
