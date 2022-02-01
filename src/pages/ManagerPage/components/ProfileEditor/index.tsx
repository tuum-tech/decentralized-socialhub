import {
  DID,
  DIDDocument,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import { IonCol, IonContent, IonGrid, IonRow } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import AboutCard from 'src/components/cards/AboutCard';
import AvatarChangeCard from 'src/components/cards/AvatarChangeCard';
import CoverPhoto from 'src/components/cards/CoverPhoto';
import EducationCard from 'src/components/cards/EducationCard';
import ExperienceCard from 'src/components/cards/ExperienceCard';
import WalletCard from 'src/components/cards/WalletCard';
import TeamCard from 'src/components/cards/TeamCard';
import ThesisCard from 'src/components/cards/ThesisCard';
import PaperCard from 'src/components/cards/PaperCard';
import LicenseCard from 'src/components/cards/LicenseCard';
import CertificationCard from 'src/components/cards/CertificationCard';
import GameExpCard from 'src/components/cards/GameExpCard';
import GamerTagsCard from 'src/components/cards/GamerTagsCard';
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
import { showNotify } from 'src/utils/notify';
import BasicCard from '../BasicCard';
import PublicFields from '../PublicFields';
import TemplateManagerCard from '../TemplateManagerCard';
import style from './style.module.scss';
import badgeDetails from 'src/data/badge_detail.json';
import NewVerificationContent, {
  NewVerificationModal
} from 'src/pages/ActivityPage/components/MyRequests/NewVerification';
import SentModalContent, {
  SentModal
} from 'src/pages/ActivityPage/components/MyRequests/SentModal';
import { VerificationService } from 'src/services/verification.service';

interface Props {
  session: ISessionItem;
  badgeUrl?: any;
  updateSession: (props: { session: ISessionItem }) => void;
}

const ProfileEditor: React.FC<Props> = ({
  session,
  badgeUrl,
  updateSession
}) => {
  const [error, setError] = useState(false);
  const [userInfo, setUserInfo] = useState<ISessionItem>(session);
  const [loaded, setloaded] = useState(false);
  const [timer, setTimer] = useState<any>(null);
  const [didDocument, setDidDocument] = useState<DIDDocument | undefined>(
    undefined
  );
  const [profile, setProfile] = useState<ProfileDTO>(defaultFullProfile);
  const [selectedCredential, setSelectedCredential] = useState<
    string | undefined
  >(undefined);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [showSentModal, setShowSentModal] = useState(false);

  const {
    account: { basicProfile, educationProfile, experienceProfile },
    socialVerify: {
      linkedin,
      facebook,
      twitter,
      google,
      github,
      discord,
      email,
      phone
    }
  } = badgeDetails;

  const handleRouteParam = (title: string) => {
    if (badgeUrl?.badge && badgeUrl.badge === title) {
      return true;
    }
    return false;
  };

  const sendRequest = async (
    dids: string[],
    credentials: VerificationData[],
    msg: string
  ) => {
    const vService = new VerificationService();
    await vService.sendRequest(session, dids, credentials, msg);
    setShowVerificationModal(false);
    setShowSentModal(true);
  };

  const handleSocialRouteParam = () => {
    if (
      badgeUrl?.badge &&
      [
        linkedin.title,
        facebook.title,
        twitter.title,
        google.title,
        github.title,
        discord.title,
        email.title,
        phone.title
      ].includes(badgeUrl.badge)
    ) {
      return true;
    } else return false;
  };

  const retriveProfile = async () => {
    if (!session.userToken) return;
    try {
      let res: ProfileDTO | undefined = await ProfileService.getFullProfile(
        session.did,
        session
      );
      if (res) {
        console.log('full profile: => ', res);
        res.basicDTO.isEnabled = true;
        res.experienceDTO.isEnabled = true;
        res.educationDTO.isEnabled = true;
        res.teamDTO.isEnabled = true;
        res.thesisDTO.isEnabled = true;
        res.paperDTO.isEnabled = true;
        res.licenseDTO.isEnabled = true;
        res.certificationDTO.isEnabled = true;
        res.gameExpDTO.isEnabled = true;
        res.gamerTagDTO.isEnabled = true;
        setProfile(res);
      }
    } catch (e) {
      setError(true);
    }
  };

  const startTimer = () => {
    const timer = setTimeout(async () => {
      // refresh DID document
      let document = await DidDocumentService.getUserDocument(session);
      setDidDocument(document);

      if (JSON.stringify(session) === JSON.stringify(userInfo)) return;

      if (session.userToken) setUserInfo(session);
      startTimer();
    }, 1000);
    setTimer(timer);
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
    if (timer) {
      clearTimeout(timer);
    }
    startTimer();
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
                requestVerification={(idKey: string) => {
                  setSelectedCredential(idKey);
                  setShowVerificationModal(true);
                }}
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
                    let vcName: VerifiableCredential;

                    if (userInfo.isEssentialUser) {
                      vcName = await didService.newSelfVerifiableCredentialFromEssentials(
                        userInfo.did,
                        'name',
                        newName
                      );
                    } else {
                      vcName = await didService.newSelfVerifiableCredential(
                        doc,
                        'name',
                        newName
                      );
                    }

                    await DidcredsService.addOrUpdateCredentialToVault(
                      session,
                      vcName
                    );
                  }

                  if (newPhone !== oldPhone) {
                    let vcPhone: VerifiableCredential;
                    if (userInfo.isEssentialUser) {
                      vcPhone = await didService.newSelfVerifiableCredentialFromEssentials(
                        userInfo.did,
                        'phone',
                        newPhone
                      );
                    } else {
                      vcPhone = await didService.newSelfVerifiableCredential(
                        doc,
                        'phone',
                        newPhone
                      );
                    }

                    await DidcredsService.addOrUpdateCredentialToVault(
                      session,
                      vcPhone
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
                    openModal={handleRouteParam(basicProfile.title)}
                  />
                )}

                <SocialProfilesCard
                  didDocument={didDocument as DIDDocument}
                  targetUser={session}
                  setSession={updateSession}
                  mode="edit"
                  openModal={handleSocialRouteParam()}
                />
                {profile && profile.educationDTO && (
                  <EducationCard
                    userSession={JSON.parse(JSON.stringify(session))}
                    educationDTO={profile.educationDTO}
                    updateFunc={async (educationItem: EducationItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      let archivedBadge = true;
                      if (
                        userSession &&
                        userSession.badges &&
                        userSession.badges.account &&
                        !userSession.badges.account.educationProfile.archived
                      ) {
                        userSession.badges.account.educationProfile.archived = new Date().getTime();
                        await updateSession({ session: userSession });
                        archivedBadge = false;
                      }
                      await ProfileService.updateEducationProfile(
                        educationItem,
                        userSession,
                        archivedBadge
                      );

                      let verificationService: VerificationService = new VerificationService();
                      await verificationService.generateVerifiableCredentialFromEducationItem(
                        educationItem,
                        session
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
                    requestFunc={async (educationItem: EducationItem) => {
                      setSelectedCredential(
                        `Education: ${educationItem.program} at ${educationItem.institution}`
                      );
                      setShowVerificationModal(true);
                    }}
                    isEditable={true}
                    template="default"
                    openModal={handleRouteParam(educationProfile.title)}
                  />
                )}
                {profile && profile.experienceDTO && (
                  <ExperienceCard
                    experienceDTO={profile.experienceDTO}
                    updateFunc={async (experienceItem: ExperienceItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      let archivedBadge = true;
                      if (!userSession) return;
                      if (
                        userSession &&
                        userSession.badges &&
                        userSession.badges.account &&
                        !userSession.badges.account.experienceProfile.archived
                      ) {
                        userSession.badges.account.experienceProfile.archived = new Date().getTime();
                        await updateSession({ session: userSession });
                        archivedBadge = false;
                      }
                      await ProfileService.updateExperienceProfile(
                        experienceItem,
                        userSession,
                        archivedBadge
                      );

                      let verificationService: VerificationService = new VerificationService();
                      await verificationService.generateVerifiableCredentialFromExperienceItem(
                        experienceItem,
                        session
                      );

                      await retriveProfile();
                    }}
                    requestFunc={async (experienceItem: ExperienceItem) => {
                      setSelectedCredential(
                        `Experience: ${experienceItem.title} at ${experienceItem.institution}`
                      );
                      setShowVerificationModal(true);
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
                    openModal={handleRouteParam(experienceProfile.title)}
                  />
                )}
                {userInfo.pageTemplate === 'crypto' && (
                  <WalletCard
                    didDocument={didDocument!}
                    isEditable={true}
                    template="default"
                    userSession={JSON.parse(JSON.stringify(session))}
                  />
                )}
                {userInfo.pageTemplate === 'gamer' && (
                  <>
                    {/* <GamerTagsCard
                      gamerTagDTO={profile.gamerTagDTO}
                      updateFunc={() => {}}
                      isEditable={true}
                      template="default"
                      userSession={JSON.parse(JSON.stringify(session))}
                      openModal={false}
                    /> */}
                    <GameExpCard
                      gameExpDTO={profile.gameExpDTO}
                      updateFunc={async (gameExpItem: GameExpItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        await ProfileService.updateGameExpProfile(
                          gameExpItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      removeFunc={async (gameExpItem: GameExpItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        if (!userSession) return;
                        await ProfileService.removeGameExpItem(
                          gameExpItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      isEditable={true}
                      template="default"
                      userSession={JSON.parse(JSON.stringify(session))}
                      openModal={false}
                    />
                  </>
                )}
                {userInfo.pageTemplate === 'soccer' && (
                  <TeamCard
                    teamDTO={profile.teamDTO}
                    updateFunc={async (teamItem: TeamItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      await ProfileService.updateTeamProfile(
                        teamItem,
                        userSession
                      );
                      await retriveProfile();
                    }}
                    removeFunc={async (teamItem: TeamItem) => {
                      let userSession = JSON.parse(JSON.stringify(session));
                      if (!userSession) return;
                      await ProfileService.removeTeamItem(
                        teamItem,
                        userSession
                      );
                      await retriveProfile();
                    }}
                    isEditable={true}
                    template="default"
                    userSession={JSON.parse(JSON.stringify(session))}
                    openModal={false}
                  />
                )}
                {userInfo.pageTemplate === 'education' && (
                  <>
                    <ThesisCard
                      thesisDTO={profile.thesisDTO}
                      updateFunc={async (thesisItem: ThesisItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        await ProfileService.updateThesisProfile(
                          thesisItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      removeFunc={async (thesisItem: ThesisItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        if (!userSession) return;
                        await ProfileService.removeThesisItem(
                          thesisItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      isEditable={true}
                      template="default"
                      userSession={JSON.parse(JSON.stringify(session))}
                      openModal={false}
                    />
                    <PaperCard
                      paperDTO={profile.paperDTO}
                      updateFunc={async (paperItem: PaperItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        await ProfileService.updatePaperProfile(
                          paperItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      removeFunc={async (paperItem: PaperItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        if (!userSession) return;
                        await ProfileService.removePaperItem(
                          paperItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      isEditable={true}
                      template="default"
                      userSession={JSON.parse(JSON.stringify(session))}
                      openModal={false}
                    />
                    <LicenseCard
                      licenseDTO={profile.licenseDTO}
                      updateFunc={async (licenseItem: LicenseItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        await ProfileService.updateLicenseProfile(
                          licenseItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      removeFunc={async (licenseItem: LicenseItem) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        if (!userSession) return;
                        await ProfileService.removeLicenseItem(
                          licenseItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      isEditable={true}
                      template="default"
                      userSession={JSON.parse(JSON.stringify(session))}
                      openModal={false}
                    />
                    <CertificationCard
                      certificationDTO={profile.certificationDTO}
                      updateFunc={async (
                        certificationItem: CertificationItem
                      ) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        await ProfileService.updateCertificationProfile(
                          certificationItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      removeFunc={async (
                        certificationItem: CertificationItem
                      ) => {
                        let userSession = JSON.parse(JSON.stringify(session));
                        if (!userSession) return;
                        await ProfileService.removeCertificationItem(
                          certificationItem,
                          userSession
                        );
                        await retriveProfile();
                      }}
                      isEditable={true}
                      template="default"
                      userSession={JSON.parse(JSON.stringify(session))}
                      openModal={false}
                    />
                  </>
                )}

                <NewVerificationModal
                  isOpen={showVerificationModal}
                  cssClass="my-custom-class"
                  backdropDismiss={false}
                >
                  <NewVerificationContent
                    session={session}
                    onClose={() => {
                      setShowVerificationModal(false);
                    }}
                    targetUser={session}
                    sendRequest={sendRequest}
                    selectedCredential={selectedCredential}
                  />
                </NewVerificationModal>

                <SentModal
                  isOpen={showSentModal}
                  cssClass="my-custom-class"
                  backdropDismiss={false}
                >
                  <SentModalContent
                    onClose={() => {
                      setShowSentModal(false);
                    }}
                  />
                </SentModal>
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
