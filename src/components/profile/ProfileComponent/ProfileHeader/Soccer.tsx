import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';
import { getCoverPhoto } from 'src/components/cards/CoverPhoto';

import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import {
  HeaderContent,
  HeaderContainer,
  HeaderImg,
  Buttons,
  IProps
} from './Crypto';

const Container = styled(HeaderContainer)`
  background-color: #4c6fff;
  span {
    color: white;
  }
`;

const Soccer: React.FC<IProps> = ({ user, signedUser }: IProps) => {
  return (
    <Container className="ion-no-padding">
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
      <HeaderImg bgImg={getCoverPhoto(user)} />
    </Container>
  );
};

export default Soccer;
