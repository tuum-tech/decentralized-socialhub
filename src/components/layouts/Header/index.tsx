import React from 'react';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import Logo from '../../Logo';
import DashboardNavbar from '../Navbar/DashboardNavbar';

const Header: React.FC = () => {
  return (
    <IonContent>
      {/*-- Contains logo and navigation --*/}
      <IonGrid>
        <IonRow>
          <IonCol size="3" push="1">
            <Logo />
          </IonCol>
          <IonCol size="9" pull="1">
            <DashboardNavbar />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Header;
