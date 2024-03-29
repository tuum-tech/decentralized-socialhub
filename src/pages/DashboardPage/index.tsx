/**
 * Page
 */
import { IonModal, IonContent } from '@ionic/react';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { up } from 'styled-breakpoints';
import { useBreakpoint } from 'styled-breakpoints/react-styled';

import style from './style.module.scss';
import { ExporeTime } from './constants';

import { UserService } from 'src/services/user.service';
import { ProfileService } from 'src/services/profile.service';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import OnBoarding from 'src/components/OnBoarding';

import NewRelease from './components/NewRelease';

import DashboardContent from './components/DashboardContent';

import DashboardHeader from './components/DashboardHeader';
import { DidService } from 'src/services/did.service.new';
import { DIDDocument, DID } from '@elastosfoundation/did-js-sdk/';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DIDDocumentAtom, FullProfileAtom } from 'src/Atoms/Atoms';
import MainLayout from 'src/components/layouts/MainLayout';
import useSession from 'src/hooks/useSession';
import request from 'src/baseplate/request';
import { OnBoardingService } from 'src/services/onboarding.service';
import { profileSlice } from 'src/store/profile/reducer';
import { selectProfileById } from 'src/store/profile/selectors';

const ReleaseModal = styled(IonModal)`
  --border-radius: 16px;
  --max-width: 541px;
  width: 100% !important;
  --background: transparent !important;
  --box-shadow: none !important;
`;

const DashboardPage: React.FC<RouteComponentProps> = () => {
  const dispatch = useDispatch();
  const { session, setSession } = useSession();

  const [willExpire, setWillExpire] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const isSmUp = useBreakpoint(up('sm'));

  const [didDocument, setDidDocument] = useRecoilState(DIDDocumentAtom);
  const setFullProfile = useSetRecoilState<ProfileDTO>(FullProfileAtom);

  //const [session, setSession] = useRecoilState(SessionAtom);
  const [currentTab, setCurrentTab] = useState('home');

  const [publishStatus, setPublishStatus] = useState(RequestStatus.NotFound);
  const [onBoardVisible, setOnBoardVisible] = useState(false);

  const {
    followings: followingDids = [],
    followers: followerDids = [],
    profileDTO = null
  } = useSelector(state => selectProfileById(state, session.did)) || {};
  const mutualDids = useMemo(
    () => followingDids.filter((did: any) => followerDids.indexOf(did) !== -1),
    [followingDids, followerDids]
  );
  const [version, setVersion] = useState<Version | null>(null);
  const history = useHistory();

  let timer: NodeJS.Timeout;
  const setTimerForStatus = () => {
    timer = setInterval(async () => {
      await refreshStatus();
    }, 5000);
  };

  const getFollowings = useCallback(() => {
    dispatch(profileSlice.actions.getFollowingDids());
  }, [dispatch]);

  const getFollowers = useCallback(() => {
    dispatch(profileSlice.actions.getFollowerDids());
  }, [dispatch]);

  const getFullProfile = useCallback(
    (did: string, userSession: ISessionItem) => {
      dispatch(profileSlice.actions.getFullProfile({ did, userSession }));
    },
    [dispatch]
  );

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
      };

      let userService = new UserService(await DidService.getInstance());
      setSession(await userService.updateSession(session));
    }
  };

  const handleCheckVersion = async (userVersion: string) => {
    const profileVersionResponse: any = await request(
      `${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/support_router/version/releaseNotes?version=latest`,
      {
        method: 'GET',
        headers: {
          'content-Type': 'application/json',
          Authorization: `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`
        }
      }
    );

    if (profileVersionResponse.meta?.code === 200) {
      let profileVersionData = profileVersionResponse.data;
      let profileVersionLatestVersion = profileVersionData.latestVersion;
      console.log(
        `User is on version '${userVersion}' and Profile App is on version '${profileVersionLatestVersion}'`
      );
      let v: Version = {
        latestVersion: userVersion,
        profileVersion: profileVersionLatestVersion,
        releaseNotes: profileVersionData.releaseNotes,
        videoUpdateUrl: profileVersionData.videoUpdateUrl
      };
      if (!userVersion || userVersion < profileVersionData.latestVersion) {
        v.latestVersion = profileVersionData.latestVersion;
        setShowReleaseModal(true);
      }
      setVersion(v);
    }
  };

  const retrieveProfile = async () => {
    setLoadingText('Please wait a moment...');

    getFullProfile(session.did, session);
    getFollowings();
    getFollowers();

    setLoadingText('');
  };

  useEffect(() => {
    if (profileDTO) {
      const profile = {
        ...profileDTO,
        experienceDTO: { ...profileDTO.experienceDTO, isEnabled: true },
        educationDTO: { ...profileDTO.educationDTO, isEnabled: true }
      };
      handleCheckVersion(profile.versionDTO?.latestVersion);
      setFullProfile(profile);
    }
  }, [profileDTO, setFullProfile]);

  useEffect(() => {
    (async () => {
      if (session && session.did !== '') {
        setPublishStatus(
          session.isDIDPublished
            ? RequestStatus.Completed
            : RequestStatus.Pending
        );
        if (!OnBoardingService.isOnBoardingCompleted(session.onBoardingInfo)) {
          setOnBoardVisible(true);
        }
        if (session.onBoardingCompleted && !willExpire) {
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
    (async () => {
      if (session && session.did !== '') {
        if (history.location.pathname === '/profile') {
          if (session.onBoardingCompleted) {
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

  if (
    onBoardVisible &&
    session.onBoardingInfo &&
    !OnBoardingService.isOnBoardingCompleted(session.onBoardingInfo)
  ) {
    return (
      <OnBoarding
        onClose={() => {
          setOnBoardVisible(false);
        }}
        setCurrentTab={setCurrentTab}
      />
    );
  }

  return (
    <MainLayout>
      {loadingText ? (
        <LoadingIndicator loadingText={loadingText} />
      ) : (
        <IonContent>
          {isSmUp && (
            <DashboardHeader
              sessionItem={session}
              publishStatus={publishStatus}
            />
          )}
          <DashboardContent
            onTutorialStart={() => {
              setOnBoardVisible(true);
            }}
            sessionItem={session}
            followerDids={followerDids}
            followingDids={followingDids}
            mutualDids={mutualDids}
            activeTab={currentTab}
            setCurrentTab={setCurrentTab}
          />

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
        </IonContent>
      )}
    </MainLayout>
  );
};

export default DashboardPage;
