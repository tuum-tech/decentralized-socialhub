import React from 'react';
import { Link } from 'react-router-dom';
import { IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import defaultCoverPhoto from 'src/assets/default/default-cover.png';
import defaultAvatar from 'src/assets/icon/dp.png';

export const Container = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
    0px 3px 8px -1px rgba(50, 50, 71, 0.05);
  :hover {
    cursor: pointer;
  }
`;
export const SpaceName = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 600;
  font-size: 20px;
  line-height: 136.52%;

  display: flex;
  align-items: center;

  color: #27272e;
`;
export const SpaceCategory = styled.p`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 162.02%;

  display: flex;
  align-items: center;
  font-feature-settings: 'salt' on;

  color: #718096;
`;

const CoverImage = styled.div<{ bgImg: string }>`
  display: flex;
  top: 0px;
  height: 150px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 10px;

  margin-top: 0px;
  width: 100%;

  border-radius: 16px 16px 0px 0px;
  background-image: url(${props => props.bgImg});
  background-repeat: no-repeat, no-repeat;
  background-position: 0 0;
  background-size: 100% 100%;
`;
export const Header = styled(IonRow)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 13px 32px;
  img {
    margin: 0;
    display: block;
  }
`;
export const SpaceInfo = styled.div`
  flex-grow: 1;
  padding: 0 10px;
`;
export const SpaceAvatar = styled.div`
  width: 60px;
  height: 60px;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    max-width: 5.5em;
    border: 3px solid var(--theme-primary-blue);
    border-radius: 46%;
    padding: 3px;
  }
`;
interface Props {
  space: Space;
  link: string;
  newTab: boolean;
}
const SpaceCard: React.FC<Props> = ({ space, link, newTab }: Props) => {
  return (
    <Link to={link} target={newTab ? '_blank' : '_self'}>
      <Container>
        <CoverImage bgImg={space.coverPhoto || defaultCoverPhoto}></CoverImage>
        <Header class="ion-justify-content-center ion-align-items-center">
          <SpaceAvatar>
            <img
              src={space.avatar || defaultAvatar}
              height="auto"
              alt="avatar"
            />
          </SpaceAvatar>
          <SpaceInfo>
            <IonGrid>
              <IonRow>
                <SpaceName>{space.name}</SpaceName>
              </IonRow>
              <IonRow className="ion-justify-content-start">
                <SpaceCategory>{space.category}</SpaceCategory>
              </IonRow>
            </IonGrid>
          </SpaceInfo>
        </Header>
      </Container>
    </Link>
  );
};

export default SpaceCard;
