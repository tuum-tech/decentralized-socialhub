import React, { useState } from 'react';
import { IonList, IonLabel, IonItem } from '@ionic/react';

import { TabsContainer } from 'src/components/profile/ProfileComponent/PublicProfileTabs';
import DashboardHome from './Home';
// import DashboardStatus from './Status';
import DashboardBadges from './Badges';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import SyncBar from 'src/components/SyncBar';

interface Props {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  didDocument: DIDDocument;
  followerDids: string[];
  followingDids: string[];
  mutualDids: string[];
}

const DashboardContent: React.FC<Props> = ({
  onTutorialStart,
  profile,
  sessionItem,
  didDocument,
  followerDids,
  followingDids,
  mutualDids
}) => {
  const [active, setActive] = useState('home');
  return (
    <TabsContainer template="default">
      <SyncBar session={sessionItem}></SyncBar>
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
        <DashboardHome
          profile={profile}
          onTutorialStart={onTutorialStart}
          didDocument={didDocument}
          activeTab={tab => {
            setActive(tab);
          }}
          followerDids={followerDids}
          followingDids={followingDids}
          mutualDids={mutualDids}
        />
      )}
      {/* {active === 'status' && <DashboardStatus />} */}
      {active === 'badges' && <DashboardBadges sessionItem={sessionItem} />}
    </TabsContainer>
  );
};

export default DashboardContent;
