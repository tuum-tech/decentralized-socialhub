import React from 'react';
import { IonSpinner, IonContent, IonCard, IonCardTitle, IonCardContent } from '@ionic/react';
import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';

const ProfileComponent: React.FC = () => {
  return (
    <IonContent className={"profilecomponent"}>
      {/*-- Default ProfileComponent --*/}
      {/* <IonSpinner /> */}

      <IonCard>
        <IonCardContent>
          <ProfileHeader />
        </IonCardContent>
      </IonCard>
    </IonContent>
  )
};

export default ProfileComponent;
