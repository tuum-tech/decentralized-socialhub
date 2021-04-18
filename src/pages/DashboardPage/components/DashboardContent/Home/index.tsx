import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

import FollowCards from 'src/components/FollowCards';
import { UserService } from 'src/services/user.service';
import SocialProfilesCard from 'src/components/cards/SocialProfilesCard';
import ManageProfile from './Left/ManageProfile';
import ExploreConnnections from './Left/ExploreConnnections';
import ManageLinks from './Left/ManageLinks';
import BeginnersTutorial from './Left/BeginnersTutorial';

import WhatIsProfile from './RightContent/WhatIsProfile';
import ConnectWithCommunity from './RightContent/ConnectWithCommunity';
import ProfileCompletion from './RightContent/ProfileCompletion';
import VerificationStatus from './RightContent/VerificationStatus';
import Badges from './RightContent/Badges';

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
}

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

const DashboardHome: React.FC<Props> = ({
  onTutorialStart,
  profile,
  sessionItem,
  didDocument
}) => {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  // const [userSession, setUserSession] = useState(UserService.GetUserSession());

  const [embededSocialProfiles, setEmbededSocialedProfiles] = useState<
    string[]
  >([]);

  const getVerifiedCredential = (
    id: string
  ): VerifiedCredential | undefined => {
    if (
      !didDocument ||
      !didDocument['id'] ||
      !didDocument['verifiableCredential']
    )
      return;
    let vcs: any[] = didDocument['verifiableCredential'].map((vc: any) => {
      if (`${vc['id']}`.endsWith(`#${id.toLowerCase()}`)) {
        let types: string[] = vc['type'];
        return {
          value: vc['credentialSubject'][id.toLowerCase()],
          isVerified: !types.includes('SelfProclaimedCredential')
        };
      }
    });
    vcs = vcs.filter(item => {
      return item !== undefined;
    });
    if (vcs && vcs.length > 0) return vcs[0];
    return;
  };

  useEffect(() => {
    const ids = ['linkedin', 'twitter', 'facebook', 'google'];
    const embededSocialProfiles = [];
    for (let i = 0; i < ids.length; i++) {
      if (getVerifiedCredential(ids[i])) {
        embededSocialProfiles.push(ids[i]);
      }
    }
    setEmbededSocialedProfiles(embededSocialProfiles);
  }, []);

  useEffect(() => {
    setTutorialVisible(sessionItem.tutorialStep !== 4);
  }, [sessionItem]);

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
          {sessionItem.tutorialStep === 4 && (
            <ExploreConnnections did={sessionItem.did} />
          )}
          {embededSocialProfiles.length === 0 && <ManageLinks />}
        </LeftCardCol>

        <RightCardCol size="4">
          <VerificationStatus />
          <ProfileCompletion />
          <WhatIsProfile />
          <ConnectWithCommunity />
          {embededSocialProfiles.length !== 0 && (
            <SocialProfilesCard
              diddocument={didDocument}
              showManageButton={false}
              sessionItem={sessionItem}
            />
          )}
          <Badges />
          {sessionItem.tutorialStep === 4 && (
            <FollowCards did={sessionItem.did} signed={true} />
          )}
        </RightCardCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHome;
