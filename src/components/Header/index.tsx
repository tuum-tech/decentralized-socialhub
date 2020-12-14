import React from 'react';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/react';
import Logo from '../Logo';
import Navbar from '../Navbar';

const Header: React.FC = () => {
  return (
    // <IonHeader className="ion-no-border">
    //  <IonToolbar>
    //   <IonTitle>Header - No Border</IonTitle>
    //  </IonToolbar>
    // </IonHeader>

    <IonContent>
      {/*-- Contains logo and navigation --*/}
      <div style={{width: '100%'}}>
        <div style={{width: '40%', float: 'left'}}>
          <Logo />
        </div>
        <div style={{width: '60%', float: 'right', height: '80px'}}>
          <Navbar />
        </div>
      </div>
    </IonContent>

    // <IonContent>
    //   {/*-- Contains logo and navigation --*/}
    //   <Logo />
    //   <Navbar />
    // </IonContent>
  )
};

export default Header;
