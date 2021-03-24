import React, { useEffect, useState } from 'react';
import { IonContent, IonGrid, IonCol, IonRow } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import { TuumTechScriptService } from 'src/services/script.service';
import {
  ProfileService,
  defaultUserInfo,
  defaultFullProfile
} from 'src/services/profile.service';

import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import AboutCard from 'src/components/cards/AboutCard';

import BasicCard from '../BasicCard';
import TemplateManagerCard from '../TemplateManagerCard';
import style from './style.module.scss';

const ProfileEditor: React.FC = () => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);
  const [loaded, setloaded] = useState(false);
  const [full_profile, setfull_profile] = useState(defaultFullProfile);

  const retriveProfile = async () => {
    let instance = UserService.GetUserSession();
    if (!instance || !instance.userToken) return;
    try {
      let profile: ProfileDTO | undefined = await ProfileService.getFullProfile(
        instance.did
      );
      if (profile) {
        profile.basicDTO.isEnabled = true;
        profile.experienceDTO.isEnabled = true;
        profile.educationDTO.isEnabled = true;
        setfull_profile(profile);
      }
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    (async () => {
      let instance = UserService.GetUserSession();
      if (!instance || !instance.userToken) return;

      setUserInfo(instance);

      if (instance.tutorialStep === 4) {
        await retriveProfile();
      }
      setloaded(true);
    })();
  }, []);

  return (
    <IonContent className={style['profileeditor']}>
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size="4">
            <TemplateManagerCard sessionItem={userInfo} />
          </IonCol>
          <IonCol size="8">
            {!error && loaded ? (
              <BasicCard
                sessionItem={userInfo}
                updateFunc={async (userInfo: ISessionItem) => {
                  await TuumTechScriptService.updateBasicProfile(userInfo);
                  UserService.updateSession(userInfo);
                }}
              ></BasicCard>
            ) : (
              ''
            )}
            {!error && loaded && userInfo.tutorialStep === 4 ? (
              <>
                {full_profile && full_profile.basicDTO && (
                  <AboutCard
                    aboutText={full_profile.basicDTO.about || ''}
                    mode="edit"
                    update={async (nextAbout: string) => {
                      const newBasicDTO = { ...full_profile.basicDTO };
                      const userSession = UserService.GetUserSession();
                      if (userSession) {
                        newBasicDTO.did = userSession.did;
                        newBasicDTO.about = nextAbout;
                        await ProfileService.updateAbout(newBasicDTO);
                      }
                    }}
                  />
                )}
                {full_profile && full_profile.educationDTO && (
                  <EducationCard
                    educationDTO={full_profile.educationDTO}
                    updateFunc={async (educationItem: EducationItem) => {
                      await ProfileService.updateEducationProfile(
                        educationItem
                      );
                    }}
                    removeFunc={async (educationItem: EducationItem) => {
                      await ProfileService.removeEducationItem(educationItem);
                    }}
                    mode="edit"
                  />
                )}
                {full_profile && full_profile.experienceDTO && (
                  <ExperienceCard
                    experienceDTO={full_profile.experienceDTO}
                    updateFunc={async (experienceItem: ExperienceItem) => {
                      await ProfileService.updateExperienceProfile(
                        experienceItem
                      );
                    }}
                    removeFunc={async (experienceItem: ExperienceItem) => {
                      await ProfileService.removeExperienceItem(experienceItem);
                    }}
                    mode="edit"
                  />
                )}
              </>
            ) : (
              ''
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonContent>
  );
};

export default ProfileEditor;
