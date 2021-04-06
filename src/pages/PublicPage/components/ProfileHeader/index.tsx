import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DidSnippet from 'src/components/DidSnippet';
import defaultAdamAvatar from 'src/assets/icon/defaultAdamAvatar.png';
import { ProfileName } from 'src/components/texts';
import { FollowButton } from 'src/components/buttons';

import FollowOrUnFollowButton from '../FollowOrUnFollow';

const HeaderContainer = styled(IonGrid)`
  background-color: white;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 99;
`;

const Banner = styled.div`
  display: flex;
  position: sticky;
  top: 0px;
  height: 176px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background-color: rgba(255, 110, 110, 1);
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
`;

const Header = styled(IonRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 43px;
  img {
    margin: 0;
    display: block;
  }
`;

const AvatarArea = styled.div`
  display: block;
  width: 100px;
`;

const Buttons = styled.div`
  display: flex;
  width: 110px;
`;

const Info = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;

interface IProps {
  user: ISessionItem;
  signedUserDid: string;
}

const ProfileHeader: React.FC<IProps> = ({ user, signedUserDid }: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <Banner />
      <Header class="ion-justify-content-center ion-align-items-center">
        <AvatarArea>
          <img src={defaultAdamAvatar} alt="default avatar" />
        </AvatarArea>
        <Info>
          <IonGrid>
            <IonRow>
              <ProfileName>{user ? user.name : ''}</ProfileName>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <IonCol>
                <DidSnippet did={user.did} />
              </IonCol>
            </IonRow>
          </IonGrid>
        </Info>
        <Buttons>
          {signedUserDid === '' ? (
            <Link to="/sign-did">
              <FollowButton>Sign in to Follow</FollowButton>
            </Link>
          ) : (
            <FollowOrUnFollowButton did={user.did} userDid={signedUserDid} />
          )}
        </Buttons>
      </Header>
    </HeaderContainer>
  );
};

export default ProfileHeader;
