import React from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';

import SpotlightCard from 'src/components/cards/SpotlightCard';
import BadgesCard from 'src/components/cards/BadgesCard';
import ButtonWhite from 'src/components/buttons/ButtonWhite';
import AboutCard from 'src/components/cards/AboutCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import EducationCard from 'src/components/cards/EducationCard';
import { ISessionItem } from 'src/services/user.service';
import ProfileCompletionCard from 'src/components/cards/ProfileCompletionCard';
import { ProfileDTO } from 'src/pages/PublicPage/types';

import { UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';
import style from './style.module.scss';

export interface DashboardProps {
  onTutorialStart: () => void;
  profile: ProfileDTO;
  sessionItem: ISessionItem;
}

const DashboardHome: React.FC<DashboardProps> = ({
  onTutorialStart,
  profile,
  sessionItem
}) => {
  const getTutorialButton = () => {
    let tutorialStep = window.localStorage.getItem('tutorial-stage');
    return (
      <div>
        <br />{' '}
        <ButtonWhite onClick={() => onTutorialStart()}>
          {tutorialStep ? 'Continue' : 'Start'} beginners tutorial
        </ButtonWhite>
      </div>
    );
  };
  console.log('=====>profile.experienceDTO', profile.experienceDTO);

  return (
    <IonGrid className={style['tab-grid']}>
      <IonRow>
        <IonCol size="8">
          <AboutCard
            aboutText={profile.basicDTO.about}
            update={async (nextAbout: string) => {
              const newBasicDTO = { ...profile.basicDTO };
              const userSession = UserService.GetUserSession();
              if (userSession) {
                newBasicDTO.did = userSession.did;
                newBasicDTO.about = nextAbout;
                await ProfileService.updateAbout(newBasicDTO);
              }
            }}
          ></AboutCard>
          <ExperienceCard
            experienceDTO={profile.experienceDTO}
          ></ExperienceCard>
          <EducationCard educationDTO={profile.educationDTO}></EducationCard>
        </IonCol>
        <IonCol size="4">
          {!sessionItem.tutorialCompleted && (
            <SpotlightCard
              title="Welcome to Profile"
              content="To get you familiar with the platform, you can start the tutorial that
        will take you through some basics of DID and Hive Vaults. You must complete this tutorial before your profile is ready."
              component={getTutorialButton()}
            />
          )}

          <ProfileCompletionCard title="Profile Completion" />
          <BadgesCard title="Badges" />
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default DashboardHome;
