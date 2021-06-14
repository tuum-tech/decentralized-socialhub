import React, { useEffect, useState } from 'react';
import { IonContent, IonGrid, IonCol, IonRow } from '@ionic/react';

import { TuumTechScriptService } from 'src/services/script.service';
import {
  ProfileService,
  defaultFullProfile
} from 'src/services/profile.service';

import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import AboutCard from 'src/components/cards/AboutCard';
import AvatarChangeCard from 'src/components/cards/AvatarChangeCard';
import CoverPhoto from 'src/components/cards/CoverPhoto';

import BasicCard from '../BasicCard';
import TemplateManagerCard from '../TemplateManagerCard';
import PublicFields from '../PublicFields';
import style from './style.module.scss';
import { DidDocumentService } from 'src/services/diddocument.service';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard/SocialCard';

interface Props {
  session: ISessionItem;
  updateSession: (props: { session: ISessionItem }) => void;
}

const ProfileEditor: React.FC<Props> = ({ session, updateSession }) => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>(session);
  const [loaded, setloaded] = useState(false);
  const [didDocument, setDidDocument] = useState({});
  const [profile, setProfile] = useState(defaultFullProfile);

  const retriveProfile = async () => {
    if (!session.userToken) return;
    try {
      let res: ProfileDTO | undefined = await ProfileService.getFullProfile(
        session.did,
        session
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
      if (session.userToken) setUserInfo(session);
      setTimer();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const refreshDidDocument = async () => {
    let documentState = await DidDocumentService.getUserDocument(session);
    setDidDocument(documentState.diddocument);
  };

  useEffect(() => {
    (async () => {
      if (!session.userToken) return;
      setUserInfo(session);
      if (session.tutorialStep === 4) {
        await retriveProfile();
      }
      setloaded(true);
    })();

    setTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonContent className={style['profileeditor']}>
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size="4">
            <TemplateManagerCard sessionItem={userInfo} />
            <PublicFields sessionItem={userInfo} />
          </IonCol>
          <IonCol size="8">
            <AvatarChangeCard />
            <CoverPhoto />
            {!error && loaded ? (
              <BasicCard
                sessionItem={userInfo}
                updateFunc={async (userInfo: ISessionItem) => {
                  await TuumTechScriptService.updateTuumUser(userInfo);
                  await updateSession({ session: userInfo });
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

                      let userSession = JSON.parse(JSON.stringify(session));
                      newBasicDTO.did = userSession.did;
                      newBasicDTO.about = nextAbout;
                      if (
                        userSession.badges &&
                        userSession.badges.account &&
                        !userSession.badges.account.basicProfile.archived
                      ) {
                        userSession.badges.account!.basicProfile.archived = new Date().getTime();
                        await updateSession({ session: userSession });
                        await ProfileService.addActivity(
                          {
                            guid: '',
                            did: userSession.did,
                            message: 'You received a Basic profile badge',
                            read: false,
                            createdAt: 0,
                            updatedAt: 0
                          },
                          userSession
                        );
                      }
                      await ProfileService.updateAbout(
                        newBasicDTO,
                        userSession
                      );
                      await ProfileService.addActivity(
                        {
                          guid: '',
                          did: userSession.did,
                          message: 'You updated basic profile',
                          read: false,
                          createdAt: 0,
                          updatedAt: 0
                        },
                        userSession
                      );
                      await retriveProfile();
                    }}
                  />
                )}

                <SocialProfilesCard
                  diddocument={didDocument}
                  showManageButton={true}
                  sessionItem={session}
                  setSession={updateSession}
                />

                {profile && profile.educationDTO && (
                  <EducationCard
                    educationDTO={profile.educationDTO}
                    updateFunc={async (educationItem: EducationItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      if (
                        userSession &&
                        userSession.badges &&
                        userSession.badges.account &&
                        !userSession.badges.account.educationProfile.archived
                      ) {
                        userSession.badges.account.educationProfile.archived = new Date().getTime();
                        await updateSession({ session: userSession });
                        await ProfileService.addActivity(
                          {
                            guid: '',
                            did: userSession.did,
                            message: 'You received a Education profile badge',
                            read: false,
                            createdAt: 0,
                            updatedAt: 0
                          },
                          userSession
                        );
                      }
                      await ProfileService.updateEducationProfile(
                        educationItem,
                        userSession
                      );
                      await ProfileService.addActivity(
                        {
                          guid: '',
                          did: userSession!.did,
                          message: 'You updated education profile',
                          read: false,
                          createdAt: 0,
                          updatedAt: 0
                        },
                        userSession
                      );
                      await retriveProfile();
                    }}
                    removeFunc={async (educationItem: EducationItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      if (!userSession) return;
                      await ProfileService.removeEducationItem(
                        educationItem,
                        userSession
                      );
                      await retriveProfile();
                    }}
                    isEditable={true}
                  />
                )}
                {profile && profile.experienceDTO && (
                  <ExperienceCard
                    experienceDTO={profile.experienceDTO}
                    updateFunc={async (experienceItem: ExperienceItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      if (!userSession) return;
                      if (
                        userSession &&
                        userSession.badges &&
                        userSession.badges.account &&
                        !userSession.badges.account.experienceProfile.archived
                      ) {
                        userSession.badges.account.experienceProfile.archived = new Date().getTime();
                        await updateSession({ session: userSession });
                        await ProfileService.addActivity(
                          {
                            guid: '',
                            did: userSession.did,
                            message: 'You received a Experience profile badge',
                            read: false,
                            createdAt: 0,
                            updatedAt: 0
                          },

                          userSession
                        );
                      }
                      await ProfileService.updateExperienceProfile(
                        experienceItem,
                        userSession
                      );
                      await ProfileService.addActivity(
                        {
                          guid: '',
                          did: userSession!.did,
                          message: 'You updated experience profile',
                          read: false,
                          createdAt: 0,
                          updatedAt: 0
                        },

                        userSession
                      );
                      await retriveProfile();
                    }}
                    removeFunc={async (experienceItem: ExperienceItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      await ProfileService.removeExperienceItem(
                        experienceItem,
                        userSession
                      );
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
