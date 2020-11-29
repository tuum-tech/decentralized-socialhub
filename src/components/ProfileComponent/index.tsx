import React from 'react';
import { IonSpinner, IonContent, IonCard, IonCardTitle, IonCardContent } from '@ionic/react';
import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';
import { ProfileContent } from 'src/pages/ProfilePage/types';

interface IProps {
  profile: ProfileContent
}

const ProfileComponent: React.FC<IProps> = ({ profile }: IProps) => {
  return (
    <IonContent className={"profilecomponent"}>
      {/*-- Default ProfileComponent --*/}
      {/* <IonSpinner /> */}

      <IonCard>
        <IonCardContent>
          <ProfileHeader profile={profile} />
        </IonCardContent>
      </IonCard>
    </IonContent>
  )
};

export default ProfileComponent;
