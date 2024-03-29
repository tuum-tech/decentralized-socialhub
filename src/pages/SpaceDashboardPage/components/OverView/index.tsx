import React from 'react';
import { Link } from 'react-router-dom';
import { IonCard, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import {
  SpaceAvatar,
  SpaceInfo,
  SpaceName,
  SpaceCategory
} from 'src/components/Space/SpaceCard';
import defaultAvatar from 'src/assets/icon/dp.png';

import { getDIDString } from 'src/utils/did';
import slugify from 'slugify';
import Icon from 'src/elements-v2/icons';
import GradientText from 'src/elements-v2/buttons/GradientText';

const Container = styled.div`
  display: flex;
  padding: 13px 32px;
  img {
    margin: 0;
    display: block;
  }
`;
interface IProps {
  profile: any;
  sessionItem: ISessionItem;
}

const OverView: React.FC<IProps> = ({ profile, sessionItem }: IProps) => {
  const { avatar, name, category, isCommunitySpace } = profile;
  const slug = slugify(name, { lower: true });
  return (
    <IonCard className={styleWidget['overview']}>
      <Container>
        <SpaceAvatar>
          <img src={avatar || defaultAvatar} height="auto" alt="avatar" />
        </SpaceAvatar>
        <SpaceInfo>
          <IonGrid>
            <IonRow>
              <SpaceName>{name}</SpaceName>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <SpaceCategory>{category}</SpaceCategory>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <SpaceCategory>{profile.meta?.network}</SpaceCategory>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <Link
                to={
                  isCommunitySpace
                    ? `/community-spaces/${slug}`
                    : `/did/${getDIDString(
                        sessionItem.did,
                        true
                      )}/spaces/${slug}`
                }
              >
                <IonRow className="ion-align-items-center ion-justify-content-between">
                  <GradientText style={{ marginRight: '5px' }}>
                    View Profile
                  </GradientText>
                  <Icon name="open-outline" color="primary" />
                </IonRow>
              </Link>
            </IonRow>
          </IonGrid>
        </SpaceInfo>
      </Container>
    </IonCard>
  );
};

export default OverView;
