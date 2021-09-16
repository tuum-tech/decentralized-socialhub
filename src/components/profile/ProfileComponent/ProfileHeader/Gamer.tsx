import React from 'react';
import { Link } from 'react-router-dom';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';
import { getCoverPhoto } from 'src/components/cards/CoverPhoto';

import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import {
  HeaderContainer,
  HeaderContent,
  HeaderImg,
  Buttons,
  IProps
} from './Crypto';

const Gamer: React.FC<IProps> = ({ user, signedUser }: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <HeaderImg bgImg={getCoverPhoto(user)} />
      <HeaderContent>
        <div className="content">
          <Avatar did={user.did} />
          <p className="name">{user.name}</p>
          <DidSnippet did={user.did} color="white" />
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
    </HeaderContainer>
  );
};

export default Gamer;
