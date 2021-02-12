import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';

const Pages: React.FC = () => {
  return (
    <IonContent className={'pages'}>
      {/*-- Default Pages --*/}
      <IonSpinner />
    </IonContent>
  );
};

export default Pages;
