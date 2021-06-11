import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import DidSnippet from 'src/components/DidSnippet';
import { ProfileName } from 'src/components/texts';
import { FollowButton } from 'src/components/buttons';
import Avatar from 'src/components/Avatar';

import FollowOrUnFollowButton from '../FollowOrUnFollow';
import defaultCoverPhoto from 'src/assets/default-cover.png';

const HeaderContainer = styled(IonGrid)`
  background-color: white;
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 99;
`;

const Banner = styled.div<{ bgImg: string }>`
  display: flex;
  position: sticky;
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
`;

const Info = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;

interface IProps {
  user: ISessionItem;
  signedUserDid: string;
  onlyText?: string;
}

const ProfileHeader: React.FC<IProps> = ({
  user,
  signedUserDid,
  onlyText = ''
}: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <Banner
        bgImg={
          user.coverPhoto && user.coverPhoto !== ''
            ? user.coverPhoto
            : defaultCoverPhoto
        }
      />
      <Header class="ion-justify-content-center ion-align-items-center">
        {onlyText === '' ? (
          <>
            <Avatar did={user.did} />
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
                <FollowOrUnFollowButton
                  did={user.did}
                  userDid={signedUserDid}
                />
              )}
            </Buttons>
          </>
        ) : (
          <p>{onlyText}</p>
        )}
      </Header>
    </HeaderContainer>
  );
};

export default ProfileHeader;
