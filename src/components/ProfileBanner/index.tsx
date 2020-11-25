import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';

const ProfileBanner: React.FC = () => {
  return (
    <IonContent className={"profilebanner"}>
      {/*-- Default ProfileBanner --*/}
      <IonSpinner />
    </IonContent>
  )
};

export default ProfileBanner;
