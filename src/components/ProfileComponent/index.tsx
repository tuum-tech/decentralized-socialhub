import React from 'react';

import { ProfileContent } from 'src/pages/ProfilePage/types';

import ProfileBanner from '../ProfileBanner';
import ProfileHeader from '../ProfileHeader';

interface IProps {
  profile: ProfileContent;
}

const ProfileComponent: React.FC<IProps> = ({ profile }: IProps) => {
  return (
    <div className={'profilecomponent'}>
      {/*-- Default ProfileComponent --*/}
      {/* <IonSpinner /> */}
      <ProfileBanner></ProfileBanner>
      <ProfileHeader profile={profile} />
    </div>
  );
};

export default ProfileComponent;
