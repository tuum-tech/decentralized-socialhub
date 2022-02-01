import React from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import styled from 'styled-components';

import { SpaceAvatar, SpaceName, SpaceCategory } from '../../SpacePage/components/MySpaces/SpaceCard';
import defaultCoverPhoto from 'src/assets/default/default-cover.png';
import defaultAvatar from 'src/assets/icon/dp.png';

const HeaderContainer = styled(IonGrid)`
  background-color: white;
`;

const Banner = styled.div<{ bgImg: string }>`
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
