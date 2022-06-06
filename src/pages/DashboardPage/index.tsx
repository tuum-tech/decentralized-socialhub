/**
 * Page
 */
import { IonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';

import style from './style.module.scss';
import { ExporeTime } from './constants';

import { FollowService } from 'src/services/follow.service';
import { UserService } from 'src/services/user.service';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { ProfileService } from 'src/services/profile.service';

import TutorialComponent from './components/Tutorial';
import NewRelease from './components/NewRelease';

import DashboardContent from './components/DashboardContent';
import OnBoarding from './components/OnBoarding';
import DashboardHeader from './components/DashboardHeader';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DidService } from 'src/services/did.service.new';
import { DIDDocument, DID } from '@elastosfoundation/did-js-sdk/';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DIDDocumentAtom, FullProfileAtom } from 'src/Atoms/Atoms';
import MainLayout from 'src/components/layouts/MainLayout';
import useSession from 'src/hooks/useSession';

const TutorialModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --max-width: 1250px;
  --height: 100%;
  --width: 100%;
  height: 100% !important;
  width: 100% !important;
  --background: transparent !important;
  --box-shadow: none !important;
`;

const ReleaseModal = styled(IonModal)`
  --border-radius: 16px;
  --max-width: 541px;
  width: 100% !important;
  --background: transparent !important;
  --box-shadow: none !important;
`;

const DashboardPage: React.FC = () => {
  const { session, setSession } = useSession();

  const [showTutorial, setShowTutorial] = useState(false);
  const [willExpire, setWillExpire] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const isSmUp = useBreakpoint(up('sm'));

  const [didDocument, setDidDocument] = useRecoilState(DIDDocumentAtom);
  const setFullProfile = useSetRecoilState<ProfileDTO>(FullProfileAtom);

  //const [session, setSession] = useRecoilState(SessionAtom);

  const [publishStatus, setPublishStatus] = useState(RequestStatus.NotFound);
  const [onBoardVisible, setOnBoardVisible] = useState(false);

  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [mutualDids, setMutualDids] = useState<string[]>([]);
  const [version, setVersion] = useState<Version | null>(null);
  const history = useHistory();

  let timer: NodeJS.Timeout;
  const setTimerForStatus = () => {
    timer = setInterval(async () => {
      await refreshStatus();
    }, 5000);
  };

  const handleCheckVersion = async () => {
    const res: any = await ProfileService.getCurrentVersion();
    if (
      !session?.latestVersion ||
      session.latestVersion < res.data.latestVersion
    ) {
      setVersion(res.data);
      setShowReleaseModal(true);
    }
    setShowReleaseModal(true);
  };

  useEffect(() => {
    handleCheckVersion();
  }, []);

  useEffect(() => {
    (async () => {
      if (didDocument === '') {
        let doc: DIDDocument = (await DID.from(
          session.did
        )?.resolve()) as DIDDocument;
        if (doc) {
          setDidDocument(doc.toString(true));
        }
      }
    })();
  }, [didDocument, session.did, setDidDocument]);

  const refreshStatus = async () => {
    if (session && session.did !== '') {
      let publishWaiting = AssistService.getPublishStatusTask(session.did);

      if (!publishWaiting) {
        clearInterval(timer);
        return;
      }

      let actual = await AssistService.refreshRequestStatus(
        publishWaiting.confirmationId,
        session.did
      );

      setPublishStatus(actual.requestStatus);

      if (actual.requestStatus === RequestStatus.Completed) {
        clearInterval(timer);
        AssistService.removePublishTask(session.did);

        let newSession = JSON.parse(JSON.stringify(session));

        if (!newSession.badges!.didPublishTimes!._1times.archived)
          newSession.badges!.didPublishTimes!._1times.archived = new Date().getTime();

        await updateUserToComplete(newSession);
        return;
      }
    }
  };

  const updateUserToComplete = async (newSession = session) => {
    if (newSession && newSession.did !== '') {
      let session = {
        ...newSession,
        isDIDPublished: true
        // onBoardingCompleted: true // WORKAROUND: when Onboarding window is closed before publishing, it sets onBoardingCompleted: true, but the session here dont get the updated session
      };

      let userService = new UserService(await DidService.getInstance());
      setSession(await userService.updateSession(session));
    }
  };

  const retrieveProfile = async () => {
    setLoadingText('Please wait a moment...');
    let profile: ProfileDTO = await ProfileService.getFullProfile(
      session.did,
      session
    );
    if (profile) {
      profile.experienceDTO.isEnabled = true;
      profile.educationDTO.isEnabled = true;
      setFullProfile(profile);
    }

    const followingDids = await FollowService.getFollowingDids(session.did);
    setFollowingDids(followingDids);

    const followerDids = await FollowService.getFollowerDids(session.did);
    setFollowerDids(followerDids);

    setLoadingText('');
  };

  useEffect(() => {
    (async () => {
      if (session && session.did !== '' && session.tutorialStep === 4) {
        setPublishStatus(
          session.isDIDPublished
            ? RequestStatus.Completed
            : RequestStatus.Pending
        );
        setOnBoardVisible(true);
        if (
          session.onBoardingCompleted &&
          session.tutorialStep === 4 &&
          !willExpire
        ) {
          setWillExpire(true);
          setTimeout(() => {
            UserService.logout();
          }, ExporeTime);
        }
      }
    })();

    refreshStatus(); //making initial request for fast retrieval and avoid delay of 5 sec
    setTimerForStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const mutualDids = followingDids.filter(
      (did: any) => followerDids.indexOf(did) !== -1
    );
    setMutualDids(mutualDids);
  }, [followingDids, followerDids]);

  useEffect(() => {
    (async () => {
      if (session && session.did !== '') {
        if (history.location.pathname === '/profile') {
          if (!session.onBoardingCompleted) setOnBoardVisible(true);

          if (
            session.tutorialStep &&
            session.tutorialStep === 4 &&
            session.onBoardingCompleted
          ) {
            setLoadingText('loading Profile Data');
            await retrieveProfile();
            setLoadingText('');
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

  useEffect(() => {
    (async () => {
      if (didDocument !== '') {
        if (session && session.did !== '') {
          let newSession = JSON.parse(JSON.stringify(session));

          const timestamp = new Date().getTime();
          let message = '';
          newSession.didPublishTime += 1;

          const didPublishTime = newSession.didPublishTime;
          if (didPublishTime === 1) {
            newSession.badges!.didPublishTimes._1times.archived = timestamp;
            message = 'You received 1 times did publish badge';
          }
          if (didPublishTime === 5) {
            newSession.badges!.didPublishTimes._5times.archived = timestamp;
            message = 'You received 5 times did publish badge';
          }
          if (didPublishTime === 10) {
            newSession.badges!.didPublishTimes._10times.archived = timestamp;
            message = 'You received 10 times did publish badge';
          }
          if (didPublishTime === 25) {
            newSession.badges!.didPublishTimes._25times.archived = timestamp;
            message = 'You received 25 times did publish badge';
          }
          if (didPublishTime === 50) {
            newSession.badges!.didPublishTimes._50times.archived = timestamp;
            message = 'You received 50 times did publish badge';
          }
          if (didPublishTime === 100) {
            newSession.badges!.didPublishTimes._100times.archived = timestamp;
            message = 'You received 100 times did publish badge';
          }
          if (message) {
            await ProfileService.addActivity(
              {
                guid: '',
                did: newSession.did,
                message: message,
                read: false,
                createdAt: 0,
                updatedAt: 0
              },

              newSession
            );

            let userService = new UserService(await DidService.getInstance());
            setSession(await userService.updateSession(newSession));
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (session.tutorialStep < 4 && onBoardVisible) {
    return (
      <OnBoarding
        completed={async (startTutorial: boolean) => {
          let newSession = {
            ...session,
            onBoardingCompleted: true
          };

          let userService = new UserService(await DidService.getInstance());
          setSession(await userService.updateSession(newSession));

          setOnBoardVisible(false);
          if (!willExpire) {
            setWillExpire(true);
            setTimeout(() => {
              UserService.logout();
            }, ExporeTime);
          }
          if (startTutorial) {
            setShowTutorial(true);
          }
        }}
        sessionItem={session}
        publishStatus={publishStatus}
      />
    );
  }

  return (
    <MainLayout>
      {loadingText ? (
        <LoadingIndicator loadingText={loadingText} />
      ) : (
        <React.Fragment>
          {isSmUp && (
            <DashboardHeader
              sessionItem={session}
              publishStatus={publishStatus}
            />
          )}
          <DashboardContent
            onTutorialStart={() => {
              setShowTutorial(true);
            }}
            sessionItem={session}
            followerDids={followerDids}
            followingDids={followingDids}
            mutualDids={mutualDids}
          />

          <TutorialModal
            isOpen={showTutorial}
            backdropDismiss={false}
            cssClass={style['tutorialpage']}
          >
            <TutorialComponent
              onClose={() => {
                setShowTutorial(false);
              }}
            />
          </TutorialModal>
          {version && (
            <ReleaseModal
              isOpen={showReleaseModal}
              backdropDismiss={false}
              cssClass={style['tutorialpage']}
            >
              <NewRelease
                onClose={() => {
                  setShowReleaseModal(false);
                }}
                contents={version}
              />
            </ReleaseModal>
          )}
        </React.Fragment>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
