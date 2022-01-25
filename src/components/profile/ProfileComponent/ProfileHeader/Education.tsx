import React from 'react';
import { Link } from 'react-router-dom';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';

import Avatar from '../../../Avatar';
import { getCoverPhoto } from '../../../cards/CoverPhoto';
import VerificationBadge from '../../../VerificatioBadge';
import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import {
  HeaderContainer,
  HeaderContent,
  HeaderImg,
  Buttons,
  IProps
} from './Crypto';

const Education: React.FC<IProps> = ({
  publicUser,
  signedUser,
  publicUserProfile
}: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <HeaderContent>
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

          <DidSnippet did={publicUser.did} color="white" />
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
    </HeaderContainer>
  );
};

export default Education;
