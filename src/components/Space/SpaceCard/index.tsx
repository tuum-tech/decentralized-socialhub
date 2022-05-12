import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import Banner from 'src/components/profile/ProfileComponent/Banner';
import defaultCoverPhoto from 'src/assets/default/default-cover.png';
import defaultAvatar from 'src/assets/icon/dp.png';
import { SpaceService } from 'src/services/space.service';
import { DefaultButton } from 'src/elements-v2/buttons';
import useSession from 'src/hooks/useSession';

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
  explore: boolean;
  newTab: boolean;
}
const SpaceCard: React.FC<Props> = ({
  space,
  link,
  explore,
  newTab
}: Props) => {
  const { session } = useSession();
  const owners = typeof space.owner === 'string' ? [space.owner] : space.owner;
  const [followers, setFollowers] = useState<string[]>(space.followers || []);
  const followable = !owners?.includes(session.did);
  const following = useMemo(() => followers.includes(session.did), [
    followers,
    session.did
  ]);

  const onFollow = async () => {
    await SpaceService.follow(session, space);
    setFollowers([...new Set([...followers, session.did])]);
  };
  const onUnfollow = async () => {
    await SpaceService.unfollow(session, space);
    setFollowers([
      ...new Set(
        followers.filter((follower: string) => follower !== session.did)
      )
    ]);
  };
  return (
    <Container>
      <Link to={link} target={newTab ? '_blank' : '_self'}>
        <Banner bgImg={space.coverPhoto || defaultCoverPhoto} />
        <IonRow className="ion-justify-content-between ion-align-items-center">
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
                <IonRow className="ion-justify-content">
                  <SpaceCategory>{space.category}</SpaceCategory>
                </IonRow>
                <IonRow className="ion-justify-content">
                  <SpaceCategory>{space.meta?.network}</SpaceCategory>
                </IonRow>
              </IonGrid>
            </SpaceInfo>
          </Header>
          {explore && followable && (
            <DefaultButton
              variant="contained"
              btnColor="primary-gradient"
              onClick={following ? onUnfollow : onFollow}
              style={{ margin: '10px 10px 10px 10px' }}
            >
              {following ? `-Unfollow` : `+Follow`}
            </DefaultButton>
          )}
        </IonRow>
      </Link>
    </Container>
  );
};

export default SpaceCard;
