import React from 'react';
import { Link } from 'react-router-dom';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';

import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import { getCoverPhoto } from './index';
import {
  HeaderContainer,
  HeaderContent,
  HeaderImg,
  Buttons,
  IProps
} from './Crypto';

const Soccer: React.FC<IProps> = ({ user, signedUser }: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <HeaderContent>
        <div className="content">
          <Avatar did={user.did} />
          <p className="name">{user.name}</p>
          <div className="intro">
            <DidSnippet did={user.did} />
          </div>
          <Buttons>
            {signedUser.did === '' ? (
              <Link to="/sign-did">
                <FollowButton>Sign in to Follow</FollowButton>
              </Link>
            ) : (
              <FollowOrUnFollowButton did={user.did} signedUser={signedUser} />
            )}
          </Buttons>
        </div>
      </HeaderContent>
      <HeaderImg bgImg={getCoverPhoto(user)} />
    </HeaderContainer>
  );
};

export default Soccer;
