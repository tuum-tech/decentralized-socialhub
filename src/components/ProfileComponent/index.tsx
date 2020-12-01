import React from 'react';
import { IonSpinner, IonContent, IonCard, IonCardTitle, IonCardContent } from '@ionic/react';
import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';
import { ProfileContent } from 'src/pages/ProfilePage/types';
import style from './style.module.scss'

interface IProps {
  profile: ProfileContent
}

const ProfileComponent: React.FC<IProps> = ({ profile }: IProps) => {
  return (
    <div className={"profilecomponent"}>
      {/*-- Default ProfileComponent --*/}
      {/* <IonSpinner /> */}
      <ProfileBanner></ProfileBanner>
      <ProfileHeader profile={profile} />
    </div >
  )
};

export default ProfileComponent;
