import React from 'react';
import { IonList, IonLabel } from '@ionic/react';
import styled from 'styled-components';
import { down } from 'styled-breakpoints';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import { TabItem } from 'src/elements-v2/tabs';

import style from './style.module.scss';

export const ConnectionTabsContainer = styled(TabsContainer)`
  ion-list,
  .tab-item {
    background-color: transparent;
    --background: transparent;
    --border-color: transparent;
  }
  padding: 5px 30px;

  ${down('sm')} {
    padding: 5px 16px;
  }
`;

const ConnectionHeaderContainer = styled.div`
  display: flex;
  align-items: center;
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
        <TabItem
          active={active === 'followers'}
          onClick={() => setActive('followers')}
          badgeCount={followersCount}
        >
          <IonLabel>Followers</IonLabel>
        </TabItem>
        <TabItem
          active={active === 'following'}
          onClick={() => setActive('following')}
          badgeCount={followingCount}
        >
          <IonLabel>Following</IonLabel>
        </TabItem>
        <TabItem
          active={active === 'mutual'}
          onClick={() => setActive('mutual')}
          badgeCount={mutualFollowerCount}
        >
          <IonLabel>Mutual Followers</IonLabel>
        </TabItem>
      </IonList>
    </ConnectionHeaderContainer>
  );
};

export default ConnectionPageHeader;
