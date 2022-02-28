import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IonCard, IonGrid, IonRow, IonIcon } from '@ionic/react';
import styled from 'styled-components';
import { openOutline } from 'ionicons/icons';
import styleWidget from 'src/components/cards/WidgetCards.module.scss';
import {
  SpaceAvatar,
  SpaceInfo,
  SpaceName,
  SpaceCategory
} from 'src/pages/SpacePage/components/MySpaces/SpaceCard';
import defaultAvatar from 'src/assets/icon/dp.png';

import { getDIDString } from 'src/utils/did';

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
  return (
    <IonCard className={styleWidget['overview']}>
      <Container>
        <SpaceAvatar>
          <img
            src={profile.avatar || defaultAvatar}
            height="auto"
            alt="avatar"
          />
        </SpaceAvatar>
        <SpaceInfo>
          <IonGrid>
            <IonRow>
              <SpaceName>{profile.name}</SpaceName>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <SpaceCategory>{profile.category}</SpaceCategory>
            </IonRow>
            <IonRow className="ion-justify-content-start">
              <Link
                to={`/did/${getDIDString(sessionItem.did, true)}/spaces/${
                  profile.name
                }`}
              >
                <IonRow className="ion-align-items-center ion-justify-content-between">
                  <p style={{ marginRight: '5px' }}>View Profile</p>
                  <IonIcon icon={openOutline} />
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