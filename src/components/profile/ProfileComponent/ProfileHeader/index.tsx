import React from 'react';

import Default from './Default';
import Crypto from './Crypto';
import Gamer from './Gamer';
import Education from './Education';
import Soccer from './Soccer';

interface IProps {
  publicUser: ISessionItem;
  publicUserProfile: ProfileDTO;
  signedUser: ISessionItem;
  onlyText?: string;
}

const ProfileHeader: React.FC<IProps> = ({
  publicUser,
  publicUserProfile,
  signedUser,
  onlyText = ''
}: IProps) => {
  if (onlyText !== '') {
    return <p>{onlyText}</p>;
  }
  const template = publicUser.pageTemplate || 'default';

  if (template === 'crypto') {
    return (
      <Crypto
        publicUser={publicUser}
        publicUserProfile={publicUserProfile}
        signedUser={signedUser}
      />
    );
  }

  if (template === 'gamer') {
    return (
      <Gamer
        publicUser={publicUser}
        publicUserProfile={publicUserProfile}
        signedUser={signedUser}
      />
    );
  }

  if (template === 'soccer') {
    return (
      <Soccer
        publicUser={publicUser}
        signedUser={signedUser}
        publicUserProfile={publicUserProfile}
      />
    );
  }

  if (template === 'education') {
    return (
      <Education
        publicUser={publicUser}
        signedUser={signedUser}
        publicUserProfile={publicUserProfile}
      />
    );
  }

  return (
    <Default
      publicUser={publicUser}
      signedUser={signedUser}
      publicUserProfile={publicUserProfile}
    />
  );
};

export default ProfileHeader;
