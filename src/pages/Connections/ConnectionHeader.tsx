import React from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';

import style from './style.module.scss';

export const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 27px 25px 20px 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${down('sm')} {
    padding: 20px;
    height: fit-content;
  }
`;

export const ConnectionTabsContainer = styled(TabsContainer)`
  ion-list,
  .tab-item {
    background-color: transparent;
    --background: transparent;
    --border-color: transparent;
  }
  padding: 5px 30px;
`;

const ConnectionHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
`;

interface ConnectionPageHeaderProps {
  active: string;
  setActive: (active: string) => void;
  followersCount: number;
  followingCount: number;
  mutualFollowerCount: number;
}

const ConnectionPageHeader: React.FC<ConnectionPageHeaderProps> = ({
  active,
  setActive,
  followersCount,
  followingCount,
  mutualFollowerCount
}) => {
  return (
    <ConnectionHeaderContainer>
      <IonList className={style['tab-list']}>
        <IonItem
          className={
            (active === 'followers' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('followers')}
        >
          <IonLabel className={style['tab-label']}>
            Followers({followersCount})
          </IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'following' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('following')}
        >
          <IonLabel className={style['tab-label']}>
            Following({followingCount})
          </IonLabel>
        </IonItem>
        <IonItem
          className={
            (active === 'mutual' ? style['tab-active'] : '') +
            ' ' +
            style['tab-item']
          }
          onClick={() => setActive('mutual')}
        >
          <IonLabel className={style['tab-label']}>
            Mutual Followers({mutualFollowerCount})
          </IonLabel>
        </IonItem>
      </IonList>
    </ConnectionHeaderContainer>
  );
};

export default ConnectionPageHeader;
