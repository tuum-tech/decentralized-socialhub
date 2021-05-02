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
import AvatarChangeCard from 'src/components/cards/AvatarChangeCard';

import BasicCard from '../BasicCard';
import TemplateManagerCard from '../TemplateManagerCard';
import style from './style.module.scss';
import { DidDocumentService } from 'src/services/diddocument.service';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard/SocialCard';

const ProfileEditor: React.FC = () => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>(defaultUserInfo);
  const [loaded, setloaded] = useState(false);
  const [didDocument, setDidDocument] = useState({});
  const [profile, setProfile] = useState(defaultFullProfile);

  const retriveProfile = async () => {
    let instance = UserService.GetUserSession();
    if (!instance || !instance.userToken) return;
    try {
      let res: ProfileDTO | undefined = await ProfileService.getFullProfile(
        instance.did
      );
      if (res) {
        res.basicDTO.isEnabled = true;
        res.experienceDTO.isEnabled = true;
        res.educationDTO.isEnabled = true;
        setProfile(res);
      }
    } catch (e) {
      setError(true);
    }
  };

  const setTimer = () => {
    const timer = setTimeout(async () => {
      await refreshDidDocument();
      let instance = UserService.GetUserSession();
      if (instance && instance.userToken) setUserInfo(instance);
      setTimer();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const refreshDidDocument = async () => {
    let userSession = UserService.GetUserSession();
    if (!userSession) {
      return;
    }
    let documentState = await DidDocumentService.getUserDocument(userSession);
    setDidDocument(documentState.diddocument);
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
    setTimer();
  }, []);

  return (
    <IonContent className={style['profileeditor']}>
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size="4">
            <TemplateManagerCard sessionItem={userInfo} />
          </IonCol>
          <IonCol size="8">
            <AvatarChangeCard />
            {!error && loaded ? (
              <BasicCard
                sessionItem={userInfo}
                updateFunc={async (userInfo: ISessionItem) => {
                  await TuumTechScriptService.updateBasicProfile(userInfo);
                  UserService.updateSession(userInfo, true);
                }}
              ></BasicCard>
            ) : (
              ''
            )}
            {!error && loaded && userInfo.tutorialStep === 4 ? (
              <>
                {profile && profile.basicDTO && (
                  <AboutCard
                    aboutText={profile.basicDTO.about || ''}
                    mode="edit"
                    update={async (nextAbout: string) => {
                      const newBasicDTO = { ...profile.basicDTO };
                      const userSession = UserService.GetUserSession();
                      if (userSession) {
                        newBasicDTO.did = userSession.did;
                        newBasicDTO.about = nextAbout;
                        if (
                          !userSession.badges?.account.basicProfile.archived
                        ) {
                          userSession.badges!.account!.basicProfile.archived = new Date().getTime();
                          await UserService.updateSession(userSession);
                        }
                        await ProfileService.updateAbout(newBasicDTO);
                        await retriveProfile();
                      }
                    }}
                  />
                )}

                <SocialProfilesCard
                  diddocument={didDocument}
                  showManageButton={true}
                  sessionItem={userInfo}
                />

                {profile && profile.educationDTO && (
                  <EducationCard
                    educationDTO={profile.educationDTO}
                    updateFunc={async (educationItem: EducationItem) => {
                      const userSession = UserService.GetUserSession();
                      if (
                        userSession &&
                        !userSession.badges?.account.educationProfile.archived
                      ) {
                        userSession.badges!.account!.educationProfile.archived = new Date().getTime();
                        await UserService.updateSession(userSession);
                      }
                      await ProfileService.updateEducationProfile(
                        educationItem
                      );
                      await retriveProfile();
                    }}
                    removeFunc={async (educationItem: EducationItem) => {
                      await ProfileService.removeEducationItem(educationItem);
                      await retriveProfile();
                    }}
                    isEditable={true}
                  />
                )}
                {profile && profile.experienceDTO && (
                  <ExperienceCard
                    experienceDTO={profile.experienceDTO}
                    updateFunc={async (experienceItem: ExperienceItem) => {
                      const userSession = UserService.GetUserSession();
                      if (
                        userSession &&
                        !userSession.badges?.account.experienceProfile.archived
                      ) {
                        userSession.badges!.account!.experienceProfile.archived = new Date().getTime();
                        await UserService.updateSession(userSession);
                      }
                      await ProfileService.updateExperienceProfile(
                        experienceItem
                      );
                      await retriveProfile();
                    }}
                    removeFunc={async (experienceItem: ExperienceItem) => {
                      await ProfileService.removeExperienceItem(experienceItem);
                      await retriveProfile();
                    }}
                    isEditable={true}
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
