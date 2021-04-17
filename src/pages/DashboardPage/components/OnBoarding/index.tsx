/**
 * Page
 */

import React, { useState } from 'react';
import { IonButton, IonImg, IonText, IonIcon } from '@ionic/react';
import clsx from 'clsx';

import { UserService } from 'src/services/user.service';
import { RequestStatus } from 'src/services/assist.service';
import AlphaContent from 'src/components/AlphaContent';
import PublishingLabel from '../PublishingLabel';
import transparentlogo from '../../../../assets/logo/transparentlogo.png';
import wavinghand from '../../../../assets/icon/wavinghand.png';
import thumbup from '../../../../assets/icon/thumbup.svg';
import defaultAdamAvatar from '../../../../assets/icon/defaultAdamAvatar.png';
import emojiCool from '../../../../assets/icon/emoji-cool.png';

import style from './style.module.scss';

interface Props {
  completed: () => void;
  publishStatus: RequestStatus;
  sessionItem: ISessionItem;
}

const OnBoardingPage: React.FC<Props> = ({
  completed,
  publishStatus,
  sessionItem
}) => {
  const [stage, setStage] = useState(1);

  const next = () => {
    setStage(stage + 1);
  };
  const close = () => {
    completed();
  };
  let userSession = UserService.GetUserSession();
  let userSessionName = '';
  if (userSession) userSessionName = userSession.name;
  return (
    <AlphaContent>
      {stage === 0 && !sessionItem.onBoardingCompleted && (
        <img className={style['transparent-logo']} src={transparentlogo} />
      )}
      {stage === 1 && !sessionItem.onBoardingCompleted && (
        <div
          className={clsx(
            style['onboarding-container'],
            style['stage1To3'],
            style['v-flex']
          )}
        >
          <div>
            <IonImg src={wavinghand} className={style['wavinghand']} />
            <h1>Welcome to Profile</h1>
          </div>

          <div className={clsx(style['stage2-content'], style['v-flex'])}>
            <p>
              Profile is a new type of digital identity owned by you where
              genuine connections happen, and real-world networking begins
              online.
            </p>

            <p>
              Profile gives you total control over your digital world all in one
              place. Finally unlock the power of your data and digital content.
            </p>
          </div>

          <IonButton className={style['next-btn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {stage === 2 && !sessionItem.onBoardingCompleted && (
        <div
          className={clsx(
            style['onboarding-container'],
            style['stage1To3'],
            style['v-flex']
          )}
        >
          <div>
            <IonImg src={thumbup} className={style['wavinghand']} />
            <h1>Your Responsibility</h1>
          </div>
          <div className={clsx(style['stage2-content'], style['v-flex'])}>
            <p>
              Before setting up your profile, you will need to complete the
              beginner's tutorial which will provide you with your secret
              keys(also known as mnemonics). This information is your
              responsibility, you own them, and we store nothing. You must
              protect and store your secret keys(also known as mnemonics)! These
              secret keys are used to issue a unique Decentralized Identifier
              (DID) and must be stored in a safe place!
            </p>

            <p>
              More information will be provided later. Ready to see what you can
              do with your new DID?
            </p>
          </div>

          <IonButton className={style['next-btn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {stage === 3 && !sessionItem.onBoardingCompleted && (
        <div
          className={clsx(
            style['onboarding-container'],
            style['stage1To3'],
            style['v-flex']
          )}
        >
          <div>
            <IonImg src={emojiCool} className={style['wavinghand']} />
            <h1>Next steps?</h1>
          </div>
          <div className={style['stage3-content']}>
            <p>
              You can edit your profile in profile manager and explore other
              people in the explore section.
            </p>
            <p style={{ marginTop: '30px' }}>
              You can view your public profile by clicking the button "View
              Profile" on the top right. This will launch a separate window, and
              shows you what your profile looks like to others.
            </p>
            <p style={{ marginTop: '40px' }}>
              You will now be taken to the dashboard where you can start the
              beginner tutorial for a more in-depth view of the platform.
            </p>
            <p style={{ marginTop: '30px' }}>
              Welcome to a living, breathing profile platform that you own and
              control!
            </p>
          </div>
          <IonButton className={style['next-btn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {(stage > 3 || sessionItem.onBoardingCompleted) &&
        sessionItem.tutorialStep < 4 &&
        publishStatus !== RequestStatus.Completed && (
          <div
            className={clsx(
              style['onboarding-container'],
              style['stage4To5'],
              style['v-flex']
            )}
          >
            <div>
              <h3>Publishing in progress...</h3>
              <p style={{ marginTop: '30px' }}>
                Your profile is being published to the blockchain. This may take
                some time. You can now close this notice and refresh your site
                in about 30 minutes.
              </p>
            </div>
            <div className={clsx(style['stage4-content'], style['v-flex'])}>
              <div className={clsx(style['avatar-container'], style['v-flex'])}>
                <IonImg
                  src={defaultAdamAvatar}
                  className={style['defaultAdamAvatar']}
                />
                <p className={style['name']}>{userSessionName}</p>
                <p>
                  <PublishingLabel status={RequestStatus.Pending} />
                </p>
              </div>
              <p>
                Once complete, your processing status will turn{' '}
                <span style={{ color: '#4C6FFF', fontWeight: 'bold' }}>
                  {' '}
                  blue,
                </span>{' '}
                and look like this:{'  '}
                <PublishingLabel status={RequestStatus.Completed} />
              </p>
            </div>

            <IonButton className={style['close-btn']} onClick={close}>
              Close
            </IonButton>
          </div>
        )}
      {(stage > 3 || sessionItem.onBoardingCompleted) &&
        sessionItem.tutorialStep < 4 &&
        publishStatus === RequestStatus.Completed && (
          <div
            className={clsx(
              style['onboarding-container'],
              style['stage4To5'],
              style['v-flex']
            )}
          >
            <div>
              <h3>Publishing Complete</h3>
              <p style={{ marginTop: '30px' }}>
                Welcome to your first decentralized profile controlled
                completely by you. Explore the dashboard and complete the
                tutorial to get started.
              </p>
            </div>
            <div className={clsx(style['stage5-content'], style['v-flex'])}>
              <div className={clsx(style['avatar-container'], style['v-flex'])}>
                <IonImg
                  src={defaultAdamAvatar}
                  className={style['defaultAdamAvatar']}
                />
                <p className={style['name']}>{userSessionName}</p>
                <p>
                  <PublishingLabel status={RequestStatus.Completed} />
                </p>
              </div>
            </div>

            <IonButton className={style['start-btn']} onClick={close}>
              Start Tutorial
            </IonButton>
          </div>
        )}
    </AlphaContent>
  );
};

export default OnBoardingPage;
