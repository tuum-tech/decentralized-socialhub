import React from 'react';

import Default from './Default';
import Crypto from './Crypto';
import Gamer from './Gamer';
import Education from './Education';
import Soccer from './Soccer';

interface IProps {
  user: ISessionItem;
  signedUser: ISessionItem;
  onlyText?: string;
}

const ProfileHeader: React.FC<IProps> = ({
  user,
  signedUser,
  onlyText = ''
}: IProps) => {
  if (onlyText !== '') {
    return <p>{onlyText}</p>;
  }
  const template = user.pageTemplate || 'default';

  if (template === 'crypto') {
    return <Crypto user={user} signedUser={signedUser} />;
  }

  if (template === 'gamer') {
    return <Gamer user={user} signedUser={signedUser} />;
  }

  if (template === 'soccer') {
    return <Soccer user={user} signedUser={signedUser} />;
  }

  if (template === 'education') {
    return <Education user={user} signedUser={signedUser} />;
  }

  return <Default user={user} signedUser={signedUser} />;
};

export default ProfileHeader;
