import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SpotlightCard from 'src/components/cards/SpotlightCard';
import BadgesCard from 'src/components/cards/BadgesCard';
import ButtonWhite from 'src/components/buttons/ButtonWhite';
import AboutCard from 'src/components/cards/AboutCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import EducationCard from 'src/components/cards/EducationCard';
import ProfileCompletionCard from 'src/components/cards/ProfileCompletionCard';
import { UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';

import style from './style.module.scss';
import SocialProfilesCard from 'src/components/cards/SocialProfilesCard';

export interface DashboardProps {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
  didDocument: any;
}

const DashboardHome: React.FC<DashboardProps> = ({
  onTutorialStart,
  profile,
  sessionItem,
  didDocument
}) => {
  const [tutorialVisible, setTutorialVisible] = useState(true);
  useEffect(() => {
    setTutorialVisible(sessionItem.tutorialStep !== 4);
  }, [sessionItem]);
  const getTutorialButton = () => {
    return (
      <div>
        <br />{' '}
        <ButtonWhite onClick={() => onTutorialStart()}>
          {sessionItem.tutorialStep && sessionItem.tutorialStep > 1 ? 'Continue' : 'Start'} beginners tutorial (
          {sessionItem.tutorialStep ? sessionItem.tutorialStep : 1} / 4)
        </ButtonWhite>
      </div>
    );
  };

  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size="8">
          {profile && profile.basicDTO && (
            <AboutCard aboutText={profile.basicDTO.about || ''} />
          )}
          {profile && profile.experienceDTO && (
            <ExperienceCard experienceDTO={profile.experienceDTO} />
          )}
          {profile && profile.educationDTO && (
            <EducationCard educationDTO={profile.educationDTO} />
          )}
        </IonCol>
        <IonCol size="4">
          {tutorialVisible && (
            <SpotlightCard
              title="Welcome to Profile"
              content="To get you familiar with the platform, you can start the tutorial that
        will take you through some basics of DID and Hive Vaults. You must complete this tutorial before your profile is ready."
              component={getTutorialButton()}
            />
          )}
          <ProfileCompletionCard title="Profile Completion" />
          <BadgesCard title="Badges" />
          <SocialProfilesCard  diddocument={didDocument} showManageButton={false} />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHome;
