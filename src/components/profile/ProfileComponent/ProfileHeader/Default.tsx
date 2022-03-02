import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DidSnippet from 'src/elements/DidSnippet';
import { ProfileName } from 'src/elements/texts';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';
import { getCoverPhoto } from 'src/components/cards/CoverPhoto';

import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import VerificationBadge from '../../../VerificatioBadge';

const HeaderContainer = styled(IonGrid)`
  background-color: white;
`;

export const Banner = styled.div<{ bgImg: string }>`
  display: flex;
  top: 0px;
  height: 176px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  font-family: 'SF Pro Display';
  font-size: 56px;
  font-weight: bold;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  box-shadow: 0px 3px 3px #00000005;

  margin-top: 0px;
  width: 100%;
  padding-bottom: 2px;

  background: #fff;
  background-image: url(${props => props.bgImg});
  background-repeat: no-repeat, no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
`;

const Header = styled(IonRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 32px;
  img {
    margin: 0;
    display: block;
  }
`;

const Buttons = styled.div`
  display: flex;
  width: 110px;
  margin-top: 10px;
`;

const Info = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;

interface IProps {
  publicUser: ISessionItem;
  signedUser: ISessionItem;
  publicUserProfile: ProfileDTO;
}

const Default: React.FC<IProps> = ({
  publicUser,
  signedUser,
  publicUserProfile
}: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <Banner bgImg={getCoverPhoto(publicUser)} />
      {/* <Banner>
        <img src={getCoverPhoto(publicUser)} />
      </Banner> */}
      <Header class="ion-justify-content-center ion-align-items-center">
        <Avatar did={publicUser.did} />
        <Info>
          <IonGrid>
            <IonRow>
              <ProfileName>{publicUser ? publicUser.name : ''}</ProfileName>
              {publicUserProfile.name &&
                publicUserProfile.name.verifiers &&
                publicUserProfile.name.verifiers.length > 0 && (
                  <VerificationBadge
                    users={publicUserProfile.name.verifiers}
                    userSession={publicUser}
                  />
                )}
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <IonCol>
                <DidSnippet did={publicUser.did} />
              </IonCol>
            </IonRow>
          </IonGrid>
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
      </Header>
    </HeaderContainer>
  );
};

export default Default;
