import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';

import { getCoverPhoto } from 'src/components/cards/CoverPhoto';
import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import VerificationBadge from '../../../VerificatioBadge';

export const HeaderContainer = styled(IonRow)`
  background-color: #141419;
  min-height: 456px;
`;

export const HeaderContent = styled(IonCol)`
  width: 50%;

  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  .content {
    margin: 0 50px;
  }

  .name {
    margin-top: 20px;
    margin-bottom: 11px;
    display: flex;
    align-items: center;

    p {
      font-weight: 600;
      font-size: 28px;
      line-height: 136.02%;
      color: #ffffff;
    }
  }

  .overview {
    font-weight: bold;
    font-size: 36px;
    line-height: 136.02%;
    color: #ffffff;
    margin-bottom: 11px;
  }
`;

export const HeaderImg = styled(IonCol)<{
  bgImg: string;
}>`
  width: 50%;
  background-image: url(${props => props.bgImg});
  background-size: cover;
  background-repeat: no-repeat;
`;

export const Buttons = styled.div`
  display: flex;
  width: 110px;
  margin-top: 10px;
`;

export interface IProps {
  publicUser: ISessionItem;
  signedUser: ISessionItem;
  publicUserProfile: ProfileDTO;
}

const Crypto: React.FC<IProps> = ({
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

export default Crypto;
