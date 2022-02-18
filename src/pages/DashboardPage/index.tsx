/**
 * Page
 */
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonButton
} from '@ionic/react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import React, { useEffect, useState } from 'react';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { SubState, InferMappedProps } from './types';
import { setSession } from 'src/store/users/actions';

import style from './style.module.scss';
import { ExporeTime } from './constants';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import { FollowService } from 'src/services/follow.service';
import { UserService } from 'src/services/user.service';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { ProfileService } from 'src/services/profile.service';

import TutorialComponent from './components/Tutorial';
import DashboardContent from './components/DashboardContent';
import OnBoarding from './components/OnBoarding';
import DashboardHeader from './components/DashboardHeader';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DidService } from 'src/services/did.service.new';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { DIDDocumentAtom, FullProfileAtom, SessionAtom } from 'src/Atoms/Atoms';

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

const DashboardPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const { session } = props;
  const [showTutorial, setShowTutorial] = useState(false);
  const [willExpire, setWillExpire] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const [didDocument, setDidDocument] = useRecoilState(DIDDocumentAtom);
  const setFullProfile = useSetRecoilState<ProfileDTO>(FullProfileAtom);

  //const [session, setSession] = useRecoilState(SessionAtom);

  const [publishStatus, setPublishStatus] = useState(RequestStatus.NotFound);
  const [onBoardVisible, setOnBoardVisible] = useState(false);

  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [mutualDids, setMutualDids] = useState<string[]>([]);

  const history = useHistory();

  let timer: NodeJS.Timeout;
  const setTimerForStatus = () => {
    timer = setInterval(async () => {
      await refreshStatus();
    }, 5000);
  };

  const refreshDidDocument = async () => {
    if (session && session.did !== '') {
      let document = await DidDocumentService.getUserDocument(props.session);
      setDidDocument(document.toString(true));
    }
  };

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
      eProps.setSession({
        session: await userService.updateSession(session)
      });

      await DidDocumentService.reloadUserDocument(session);
    }
  };

  const retriveProfile = async () => {
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
        await refreshDidDocument();

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
      console.log('====>history', history.location.pathname);
      if (session && session.did !== '') {
        if (history.location.pathname === '/profile') {
          if (!session.onBoardingCompleted) setOnBoardVisible(true);

          if (
            session.tutorialStep &&
            session.tutorialStep === 4 &&
            session.onBoardingCompleted
          ) {
            setLoadingText('loading Profile Data');
            await retriveProfile();
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
          let newSession = JSON.parse(JSON.stringify(props.session));

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
            eProps.setSession({
              session: await userService.updateSession(newSession)
            });
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
          let session = {
            ...props.session,
            onBoardingCompleted: true
          };

          let userService = new UserService(await DidService.getInstance());
          eProps.setSession({
            session: await userService.updateSession(session)
          });

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
    <IonPage>
      {loadingText && loadingText !== '' ? (
        <LoadingIndicator loadingText={loadingText} />
      ) : (
        <IonContent className={style['profilepage']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <DashboardHeader
                  sessionItem={session}
                  publishStatus={publishStatus}
                />
                {didDocument !== '' ? (
                  <DashboardContent
                    onTutorialStart={() => {
                      setShowTutorial(true);
                    }}
                    sessionItem={session}
                    followerDids={followerDids}
                    followingDids={followingDids}
                    mutualDids={mutualDids}
                  />
                ) : (
                  ''
                )}
              </IonCol>
            </IonRow>
          </IonGrid>

          <TutorialModal
            isOpen={showTutorial}
            backdropDismiss={false}
            cssClass={style['tutorialpage']}
          >
            <TutorialComponent
              onClose={() => {
                setShowTutorial(false);
              }}
              session={props.session}
            />
          </TutorialModal>
        </IonContent>
      )}
    </IonPage>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage);
