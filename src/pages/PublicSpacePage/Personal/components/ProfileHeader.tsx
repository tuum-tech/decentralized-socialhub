import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';

import {
  SpaceAvatar,
  SpaceName,
  SpaceCategory
} from 'src/components/Space/SpaceCard';
import Banner from 'src/components/profile/ProfileComponent/Banner';
import defaultCoverPhoto from 'src/assets/default/default-cover.png';
import defaultAvatar from 'src/assets/icon/dp.png';

const HeaderContainer = styled(IonGrid)`
  background-color: white;
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

const Info = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;

interface IProps {
  profile: any;
}

const ProfileHeader: React.FC<IProps> = ({ profile }: IProps) => {
  return (
    <HeaderContainer className="ion-no-padding">
      <Banner bgImg={profile.coverPhoto || defaultCoverPhoto} />
      <Header class="ion-justify-content-center ion-align-items-center">
        <SpaceAvatar>
          <img
            src={profile.avatar || defaultAvatar}
            height="auto"
            alt="avatar"
          />
        </SpaceAvatar>
        <Info>
          <IonGrid>
            <IonRow>
              <SpaceName>{profile.name}</SpaceName>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <IonCol>
                <SpaceCategory>{profile.category}</SpaceCategory>
              </IonCol>
            </IonRow>
          </IonGrid>
        </Info>
      </Header>
    </HeaderContainer>
  );
};

export default ProfileHeader;
