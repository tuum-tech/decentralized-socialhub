import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';

const ProfileComponent: React.FC = () => {
  return (
    <IonContent className={"profilecomponent"}>
      {/*-- Default ProfileComponent --*/}
      <IonSpinner />
    </IonContent>
  )
};

export default ProfileComponent;
