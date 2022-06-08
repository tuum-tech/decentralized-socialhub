import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import DidSnippet from 'src/elements/DidSnippet';
import { ProfileName } from 'src/elements/texts';
import { FollowButton } from 'src/elements/buttons';
import Avatar from 'src/components/Avatar';
import Banner from 'src/components/profile/ProfileComponent/Banner';
import { getCoverPhoto } from 'src/components/cards/CoverPhoto';

import FollowOrUnFollowButton from '../../FollowOrUnFollow';
import VerificationBadge from '../../../VerificatioBadge';

const Header = styled(IonRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  padding: 13px 32px;
  img {
    margin: 0;
    display: block;
  }
  ${down('sm')} {
    margin-top: 15px;
    box-shadow: 0px 0px 1px rgb(12 26 75 / 24%),
      0px 3px 8px -1px rgb(50 50 71 / 5%);
    border-radius: 16px;
  }
`;

const Buttons = styled.div`
  display: flex;
  width: 110px;
  margin-top: 10px;
`;

const Info = styled.div`
  width: calc(100% - 90px);
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
    <IonGrid className="ion-no-padding">
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
                <DidSnippet
                  did={publicUser.did}
                  dateJoined={publicUser.timestamp}
                />
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
    </IonGrid>
  );
};

export default Default;
