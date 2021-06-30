import React from 'react';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import Logo from '../../../elements/Logo';
import LeftSideMenu from '../LeftSideMenu';

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
            <LeftSideMenu />
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default Header;
