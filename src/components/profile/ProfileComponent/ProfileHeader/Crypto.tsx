import React from 'react';
import { IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DidSnippet from 'src/elements/DidSnippet';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';

import { getCoverPhoto } from 'src/components/cards/CoverPhoto';
import FollowOrUnFollowButton from '../../FollowOrUnFollow';

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
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #ffffff;
    margin-top: 20px;
    margin-bottom: 11px;
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
  user: ISessionItem;
  signedUser: ISessionItem;
}

const Crypto: React.FC<IProps> = ({ user, signedUser }: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
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
    </HeaderContainer>
  );
};

export default Crypto;
