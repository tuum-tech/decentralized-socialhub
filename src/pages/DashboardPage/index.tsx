/**
 * Page
 */
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonModal
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

import Logo from 'src/elements/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import { FollowService } from 'src/services/follow.service';
import { UserService } from 'src/services/user.service';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import {
  ProfileService,
  defaultFullProfile
} from 'src/services/profile.service';

import TutorialComponent from './components/Tutorial';
import DashboardContent from './components/DashboardContent';
import OnBoarding from './components/OnBoarding';
import DashboardHeader from './components/DashboardHeader';
import { DidDocumentService } from 'src/services/diddocument.service';
import { DidService } from 'src/services/did.service.new';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

const TutorialModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 100%;
  --width: 100%;
  height: 100% !important;
  width: 100% !important;
  --background: transparent !important;
  --box-shadow: none !important;
`;

const ProfilePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const { session } = props;
  const [showTutorial, setShowTutorial] = useState(false);
  const [willExpire, setWillExpire] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const [full_profile, setfull_profile] = useState(defaultFullProfile);
  const [didDocument, setDidDocument] = useState<DIDDocument | null>(null);
  const [publishStatus, setPublishStatus] = useState(RequestStatus.NotFound);
  const [onBoardVisible, setOnBoardVisible] = useState(false);

  const [followingDids, setFollowingDids] = useState<string[]>([]);
  const [followerDids, setFollowerDids] = useState<string[]>([]);
  const [mutualDids, setMutualDids] = useState<string[]>([]);

  const history = useHistory();

  const setTimerForDid = () => {
    const timer = setTimeout(async () => {
      await refreshDidDocument();
      setTimerForDid();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const setTimerForStatus = () => {
    const timer = setTimeout(async () => {
      await refreshStatus();
      setTimerForStatus();
    }, 5000);
    return () => clearTimeout(timer);
  };

  const refreshDidDocument = async () => {
    if (props.session && props.session.did !== '') {
      let document = await DidDocumentService.getUserDocument(props.session);
      setDidDocument(document);
    }
  };

  const refreshStatus = async () => {
    if (props.session && props.session.did !== '') {
      let publishWaiting = AssistService.getPublishStatusTask(
        props.session.did
      );

      if (!publishWaiting) return;

      let actual = await AssistService.refreshRequestStatus(
        publishWaiting.confirmationId,
        props.session.did
      );

      setPublishStatus(actual.requestStatus);

      if (actual.requestStatus === RequestStatus.Completed) {
        AssistService.removePublishTask(props.session.did);

        let newSession = JSON.parse(JSON.stringify(props.session));

        if (!newSession.badges!.didPublishTimes!._1times.archived)
          newSession.badges!.didPublishTimes!._1times.archived = new Date().getTime();

        await updateUserToComplete(newSession);
        return;
      }
    }
  };

  const updateUserToComplete = async (newSession = props.session) => {
    if (newSession && newSession.did !== '') {
      let session = {
        ...newSession,
        isDIDPublished: true,
        onBoardingCompleted: true // WORKAROUND: when Onboarding window is closed before publishing, it sets onBoardingCompleted: true, but the session here dont get the updated session
      };

      let userService = new UserService(await DidService.getInstance());
      eProps.setSession({
        session: await userService.updateSession(session)
      });

      await DidDocumentService.reloadUserDocument(session);
    }
  };

  const retriveProfile = async () => {
    if (props.session && props.session.did !== '') {
      setLoadingText('Please wait a moment...');
      let profile: ProfileDTO | undefined = await ProfileService.getFullProfile(
        props.session.did,
        props.session
      );
      if (profile) {
        profile.experienceDTO.isEnabled = true;
        profile.educationDTO.isEnabled = true;
        setfull_profile(profile);
      }
      setLoadingText('');
    }
  };

  useEffect(() => {
    (async () => {
      if (props.session && props.session.did !== '') {
        await refreshDidDocument();

        const followingDids = await FollowService.getFollowingDids(
          props.session.did,
          props.session
        );
        setFollowingDids(followingDids);

        const followerDids = await FollowService.getFollowerDids(
          props.session.did,
          props.session
        );
        setFollowerDids(followerDids);

        setPublishStatus(
          props.session.isDIDPublished
            ? RequestStatus.Completed
            : RequestStatus.Pending
        );
        setOnBoardVisible(true);
        if (
          props.session.onBoardingCompleted &&
          props.session.tutorialStep === 4 &&
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
    setTimerForDid();
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
      if (props.session && props.session.did !== '') {
        if (history.location.pathname === '/profile') {
          setOnBoardVisible(true);
          if (
            props.session.tutorialStep &&
            props.session.tutorialStep === 4 &&
            props.session.onBoardingCompleted
          ) {
            await retriveProfile();
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history.location.pathname]);

  useEffect(() => {
    (async () => {
      if (didDocument !== null) {
        if (props.session && props.session.did !== '') {
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
      {loadingText && loadingText !== '' && (
        <LoadingIndicator loadingText={loadingText} />
      )}
      <IonContent className={style['profilepage']}>
        <IonGrid className={style['profilepagegrid']}>
          <IonRow className={style['profilecontent']}>
            <IonCol size="2" className={style['left-panel']}>
              <Logo />
              <LeftSideMenu />
            </IonCol>
            <IonCol size="10" className={style['right-panel']}>
              <DashboardHeader
                sessionItem={session}
                publishStatus={publishStatus}
              />

              <DashboardContent
                onTutorialStart={() => {
                  setShowTutorial(true);
                }}
                profile={full_profile}
                sessionItem={session}
                didDocument={didDocument as DIDDocument}
                followerDids={followerDids}
                followingDids={followingDids}
                mutualDids={mutualDids}
              />
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);
