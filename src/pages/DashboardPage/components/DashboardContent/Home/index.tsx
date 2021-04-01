import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import styled from 'styled-components';

// import SpotlightCard from 'src/components/cards/SpotlightCard';
// import BadgesCard from 'src/components/cards/BadgesCard';
// import ButtonWhite from 'src/components/buttons/ButtonWhite';
// import AboutCard from 'src/components/cards/AboutCard';
// import ExperienceCard from 'src/components/cards/ExperienceCard';
// import EducationCard from 'src/components/cards/EducationCard';
// import ProfileCompletionCard from 'src/components/cards/ProfileCompletionCard';
import SocialProfilesCard from 'src/components/cards/SocialProfilesCard';

import ManageProfile from './Left/ManageProfile';
import ExploreConnnections from './Left/ExploreConnnections';
import ManageLinks from './Left/ManageLinks';
import BeginnersTutorial from './Left/BeginnersTutorial';

import WhatIsProfile from './RightContent/WhatIsProfile';
import ConnectWithCommunity from './RightContent/ConnectWithCommunity';
import ProfileCompletion from './RightContent/ProfileCompletion';
import VerificationStatus from './RightContent/VerificationStatus';

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

const DashboardHome: React.FC<Props> = ({
  onTutorialStart,
  profile,
  sessionItem,
  didDocument
}) => {
  const [tutorialVisible, setTutorialVisible] = useState(true);

  useEffect(() => {
    setTutorialVisible(sessionItem.tutorialStep !== 4);
  }, [sessionItem]);

  return (
    <IonGrid className="ion-no-padding">
      <IonRow className="ion-no-padding">
        <LeftCardCol size="8">
          {/* {profile && profile.basicDTO && (
            <AboutCard aboutText={profile.basicDTO.about || ''} />
          )}
          {profile && profile.experienceDTO && (
            <ExperienceCard experienceDTO={profile.experienceDTO} />
          )}
          {profile && profile.educationDTO && (
            <EducationCard educationDTO={profile.educationDTO} />
          )} */}
          {tutorialVisible && (
            <BeginnersTutorial
              onTutorialStart={onTutorialStart}
              tutorialStep={sessionItem.tutorialStep}
            />
          )}

          <ManageProfile />
          <ExploreConnnections />
          <ManageLinks />
        </LeftCardCol>
        <RightCardCol size="4">
          <VerificationStatus />
          <ProfileCompletion />
          <WhatIsProfile />
          <ConnectWithCommunity />

          {/*  <BadgesCard title="Badges" /> */}
          <SocialProfilesCard
            diddocument={didDocument}
            showManageButton={false}
          />
        </RightCardCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHome;
