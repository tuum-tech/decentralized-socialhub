import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import FollowCards from 'src/components/FollowCards';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard/SocialCard';
import { loadFollowingUsers, loadFollowerUsers } from 'src/utils/follow';

import ManageProfile from './Left/ManageProfile';
import ExploreConnnections from './Left/ExploreConnnections';
import ManageLinks from './Left/ManageLinks';
import BeginnersTutorial from './Left/BeginnersTutorial';
import WhatIsProfile from './Right/WhatIsProfile';
import ConnectWithCommunity from './Right/ConnectWithCommunity';
import ProfileCompletion from './Right/ProfileCompletion';
import VerificationStatus from './Right/VerificationStatus';
import Badges from './Right/Badges';

const LeftCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

const RightCardCol = styled(IonCol)`
  padding: 22px 16px;
`;

export interface Props {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  didDocument: any;
  activeTab: (tab: string) => void;
}

const DashboardHome: React.FC<Props> = ({
  onTutorialStart,
  profile,
  sessionItem,
  didDocument,
  activeTab
}) => {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  const [hasFollowUsers, setFollowUsers] = useState(false);

  useEffect(() => {
    setTutorialVisible(sessionItem.tutorialStep !== 4);
  }, [sessionItem]);

  useEffect(() => {
    (async () => {
      const followerUsers = await loadFollowingUsers(sessionItem.did);
      const followingUsers = await loadFollowerUsers(sessionItem.did);
      setFollowUsers(followerUsers.length + followingUsers.length > 0);
    })();
  }, []);

  const hasSocialProfiles =
    didDocument.verifiableCredential &&
    didDocument.verifiableCredential.length > 1;

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-no-padding">
        <LeftCardCol size="8">
          {tutorialVisible && (
            <BeginnersTutorial
              onTutorialStart={onTutorialStart}
              tutorialStep={sessionItem.tutorialStep}
            />
          )}
          <ManageProfile profile={profile} />
          {!hasFollowUsers && sessionItem.did && sessionItem.did !== '' && (
            <ExploreConnnections did={sessionItem.did} />
          )}
          {!hasSocialProfiles && <ManageLinks />}
        </LeftCardCol>
        <RightCardCol size="4">
          <VerificationStatus />
          <ProfileCompletion />
          <WhatIsProfile />
          <ConnectWithCommunity />
          {hasSocialProfiles && (
            <SocialProfilesCard
              diddocument={didDocument}
              sessionItem={sessionItem}
              showManageButton={false}
            />
          )}
          <Badges
            badges={sessionItem.badges!}
            exploreAll={() => {
              activeTab('badges');
            }}
          />
          {sessionItem.tutorialStep === 4 && (
            <FollowCards did={sessionItem.did} signed={true} />
          )}
        </RightCardCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHome;
