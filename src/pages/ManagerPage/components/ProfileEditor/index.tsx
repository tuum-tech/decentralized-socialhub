import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import AboutCard from 'src/components/cards/AboutCard';
import AvatarChangeCard from 'src/components/cards/AvatarChangeCard';
import CoverPhoto from 'src/components/cards/CoverPhoto';
import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import SocialProfilesCard from 'src/components/cards/SocialProfileCard';
import SyncBar from 'src/components/SyncBar';
import { DidService } from 'src/services/did.service.new';
import { DidcredsService } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import {
  defaultFullProfile,
  ProfileService
} from 'src/services/profile.service';
import { TuumTechScriptService } from 'src/services/script.service';
import { SyncService } from 'src/services/sync.service';
import { showNotify } from 'src/utils/notify';
import BasicCard from '../BasicCard';
import PublicFields from '../PublicFields';
import TemplateManagerCard from '../TemplateManagerCard';
import style from './style.module.scss';

interface Props {
  session: ISessionItem;
  updateSession: (props: { session: ISessionItem }) => void;
}

const ProfileEditor: React.FC<Props> = ({ session, updateSession }) => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>(session);
  const [loaded, setloaded] = useState(false);
  const [hasDifferences, setHasDifferences] = useState(false);
  const [didDocument, setDidDocument] = useState<DIDDocument | undefined>(
    undefined
  );
  const [profile, setProfile] = useState<ProfileDTO>(defaultFullProfile);

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
      // refresh DID document
      let document = await DidDocumentService.getUserDocument(session);
      setDidDocument(document);

      let hasDiff = await SyncService.HasDifferences(session);
      setHasDifferences(hasDiff);

      if (JSON.stringify(session) === JSON.stringify(userInfo)) return;

      if (session.userToken) setUserInfo(session);
      setTimer();
    }, 1000);
    return () => clearTimeout(timer);
  };

  useEffect(() => {
    (async () => {
      if (!session.userToken) return;
      setUserInfo(session);
      if (session.tutorialStep === 4) {
        await retriveProfile();
      }

      let didService = await DidService.getInstance();
      let doc = await didService.getStoredDocument(new DID(session.did));
      setDidDocument(doc);
      setloaded(true);
    })();
    setTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  return (
    <IonContent className={style['profileeditor']}>
      <IonGrid className={style['profileeditorgrid']}>
        <IonRow>
          <IonCol size="12">
            <SyncBar session={session}></SyncBar>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="4">
            <TemplateManagerCard
              sessionItem={session}
              updateSession={updateSession}
            />
            <PublicFields sessionItem={userInfo} />
          </IonCol>
          <IonCol size="8">
            <AvatarChangeCard />
            <CoverPhoto />
            {!error && loaded ? (
              <BasicCard
                sessionItem={userInfo}
                updateFunc={async (newUserInfo: ISessionItem) => {
                  const newName = newUserInfo.name!;
                  const oldName = userInfo.name!;

                  const newPhone = newUserInfo.loginCred?.phone;
                  const oldPhone = userInfo.loginCred?.phone;

                  let didService = await DidService.getInstance();
                  let doc = await didService.getStoredDocument(
                    new DID(session.did)
                  );

                  if (newName !== oldName) {
                    let vc = await didService.newSelfVerifiableCredential(
                      doc,
                      'name',
                      newName
                    );

                    await DidcredsService.addOrUpdateCredentialToVault(
                      session,
                      vc
                    );
                  }

                  if (newPhone !== oldPhone) {
                    let vc = await didService.newSelfVerifiableCredential(
                      doc,
                      'phone',
                      newPhone
                    );

                    await DidcredsService.addOrUpdateCredentialToVault(
                      session,
                      vc
                    );
                  }

                  await TuumTechScriptService.updateTuumUser(newUserInfo);
                  await updateSession({ session: newUserInfo });
                  showNotify('Basic info is successfuly saved', 'success');
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
                  didDocument={didDocument as DIDDocument}
                  targetUser={session}
                  setSession={updateSession}
                  mode="edit"
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
                    template="default"
                    userSession={JSON.parse(JSON.stringify(session))}
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
                    template="default"
                    userSession={JSON.parse(JSON.stringify(session))}
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
