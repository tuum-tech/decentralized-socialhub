import React from 'react';
import { IonContent, IonImg } from '@ionic/react';

const Logo: React.FC = () => {
  return (
    <IonContent style={{height: '80px'}}>
      <div style={{width: '100%', height: '80px'}}>
        <IonImg src="../../assets/logo_clearlyme.svg" style={{ width: '200px', margin: '0 auto',height: '100%'}}></IonImg>
      </div>
    </IonContent>
  )
};

export default Logo;
