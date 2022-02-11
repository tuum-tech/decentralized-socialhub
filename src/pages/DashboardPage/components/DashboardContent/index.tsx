import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import DashboardHome from './Home';
// import DashboardStatus from './Status';
import DashboardBadges from './Badges';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import SyncBar from 'src/components/SyncBar';
import styled from 'styled-components';

interface Props {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
}

const SyncDiv = styled.div`
  margin-left: 25px;
  margin-top: 15px;
  margin-right: 25px;
`;

const DashboardContent: React.FC<Props> = ({
  onTutorialStart,
  profile,
  sessionItem,
  followerDids,
  followingDids,
  mutualDids
}) => {
  const [active, setActive] = useState('home');
  return (
    <TabsContainer template="default">
      <IonList>
        <IonItem
          className={(active === 'home' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('home')}
        >
          <IonLabel className="tab-label">Home</IonLabel>
        </IonItem>
        {/* <IonItem
          className={(active === 'status' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('status')}
        >
          <IonLabel className="tab-label">Status</IonLabel>
        </IonItem> */}
        <IonItem
          className={(active === 'badges' ? 'tab-active' : '') + ' tab-item'}
          onClick={() => setActive('badges')}
        >
          <IonLabel className="tab-label">Badges</IonLabel>
        </IonItem>
      </IonList>

      {active === 'home' && (
        <>
          <SyncDiv>
            <SyncBar session={sessionItem}></SyncBar>
          </SyncDiv>
          <DashboardHome
            profile={profile}
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
