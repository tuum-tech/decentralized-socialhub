import React from 'react';
import { IonContent } from '@ionic/react';

const Navbar: React.FC = () => {
  return (
    <IonContent>
      <div style={{width: '100%', lineHeight: '50px'}}>
        <p style={{height: '100%',  marginLeft: '780px', letterSpacing: '0px', color: '#FFF', opacity: '1', lineHeight: '50px', font: 'normal normal 600 14px/34px Open Sans'}}>
          How it works?
        </p>
      </div>
    </IonContent>
  )
};

export default Navbar;
