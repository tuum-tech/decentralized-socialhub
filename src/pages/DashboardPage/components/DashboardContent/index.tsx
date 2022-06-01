import React, { useState } from 'react';
import { IonList, IonLabel } from '@ionic/react';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import DashboardHome from './Home';
// import DashboardStatus from './Status';
import DashboardBadges from './Badges';
import SyncBar from 'src/components/SyncBar';
import styled from 'styled-components';
import { TabItem } from 'src/elements-v2/tabs';

const SyncDiv = styled.div`
  margin-left: 25px;
  margin-top: 15px;
  margin-right: 25px;
`;

const TabList = styled(IonList)`
  background: none;
  padding-left: 20px;
`;

interface Props {
  onTutorialStart: () => void;
  sessionItem: ISessionItem;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
}

const DashboardContent: React.FC<Props> = ({
  onTutorialStart,
  sessionItem,
  followerDids,
  followingDids,
  mutualDids
}) => {
  const [active, setActive] = useState('home');
  return (
    <TabsContainer template="default">
      <TabList>
        <TabItem active={active === 'home'} onClick={() => setActive('home')}>
          <IonLabel>Home</IonLabel>
        </TabItem>
        {/* <TabItem
          active={active === 'status'}
          onClick={() => setActive('status')}
        >
          <IonLabel>Status</IonLabel>
        </TabItem> */}
        <TabItem
          active={active === 'badges'}
          onClick={() => setActive('badges')}
        >
          <IonLabel>Badges</IonLabel>
        </TabItem>
      </TabList>

      {active === 'home' && (
        <>
          <SyncDiv>
            <SyncBar session={sessionItem}></SyncBar>
          </SyncDiv>
          <DashboardHome
            onTutorialStart={onTutorialStart}
            activeTab={tab => {
              setActive(tab);
            }}
            followerDids={followerDids}
            followingDids={followingDids}
            mutualDids={mutualDids}
          />
        </>
      )}
      {/* {active === 'status' && <DashboardStatus />} */}
      {active === 'badges' && <DashboardBadges sessionItem={sessionItem} />}
    </TabsContainer>
  );
};

export default DashboardContent;
