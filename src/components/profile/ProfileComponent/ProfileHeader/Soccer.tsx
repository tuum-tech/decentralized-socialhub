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
import VerificationBadge from '../../../VerificatioBadge';

const Container = styled(HeaderContainer)`
  span {
    color: white;
  }
`;

const Soccer: React.FC<IProps> = ({
  publicUser,
  signedUser,
  publicUserProfile
}: IProps) => {
  return (
    <Container className="ion-no-padding">
      <HeaderContent background="#4C6FFF">
        <div className="content">
          <Avatar did={publicUser.did} />
          <div className="name">
            <p>{publicUser.name}</p>
            {publicUserProfile.name &&
              publicUserProfile.name.verifiers &&
              publicUserProfile.name.verifiers.length > 0 && (
                <VerificationBadge
                  users={publicUserProfile.name.verifiers}
                  userSession={publicUser}
                />
              )}
          </div>
          <DidSnippet
            did={publicUser.did}
            dateJoined={publicUser.timestamp}
            color="white"
          />
          <Buttons>
            {signedUser.did === '' ? (
              <Link to="/sign-in">
                <FollowButton width={140}>Sign in to Follow</FollowButton>
              </Link>
            ) : (
              <FollowOrUnFollowButton
                did={publicUser.did}
                signedUser={signedUser}
              />
            )}
          </Buttons>
        </div>
      </HeaderContent>
      <HeaderImg bgImg={getCoverPhoto(publicUser)} />
    </Container>
  );
};

export default Soccer;
