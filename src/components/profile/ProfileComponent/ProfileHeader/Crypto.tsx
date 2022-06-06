import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';

import { getCoverPhoto } from 'src/components/cards/CoverPhoto';
import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import VerificationBadge from '../../../VerificatioBadge';

export const Info = styled.div`
  ${down('sm')} {
    width: calc(100% - 90px);
    padding: 0 10px;
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  min-height: 456px;
  ${down('sm')} {
    flex-direction: column;
    min-height: auto;
  }
`;

export const HeaderContent = styled.div<{ background: string }>`
  width: 50%;
  ${down('sm')} {
    width: 100%;
    order: 1;
    border-radius: 20px;
  }
  background-color: ${props => props.background};
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  justify-content: center;

  .content {
    width: 100%;
    padding: 0 50px;
    ${down('sm')} {
      display: flex;
      align-items: center;
      padding: 20px 24px;
    }
  }

  .name {
    margin-top: 20px;
    ${down('sm')} {
      margin-top: 0;
    }
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

  h1 {
    max-width: 90%;
  }

  .overview {
    font-weight: bold;
    font-size: 36px;
    line-height: 136.02%;
    color: #ffffff;
    margin-bottom: 11px;
  }
`;

export const HeaderImg = styled.div<{
  bgImg: string;
}>`
  width: 50%;
  ${down('sm')} {
    width: 100%;
    height: 170px;
    order: 0;
    border-radius: 20px;
    margin-bottom: 15px;
  }
  background-image: url(${props => props.bgImg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
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
      <HeaderContent background="#141419">
        <div className="content">
          <Avatar did={publicUser.did} />
          <Info>
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
          </Info>
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
