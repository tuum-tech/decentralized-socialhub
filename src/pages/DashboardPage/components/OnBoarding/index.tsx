/**
 * Page
 */

import React, { useState } from 'react';
import { IonButton, IonImg } from '@ionic/react';

import { UserService } from 'src/services/user.service';

import AlphaContent from 'src/components/AlphaContent';
import transparentlogo from '../../../../assets/logo/transparentlogo.png';
import wavinghand from '../../../../assets/icon/wavinghand.png';
import lockicon from '../../../../assets/icon/lock.png';
import defaultAdamAvatar from '../../../../assets/icon/defaultAdamAvatar.png';
import emojiCool from '../../../../assets/icon/emoji-cool.png';

import style from './style.module.scss';

interface Props {
  completed: () => void;
}

const OnBoardingPage: React.FC<Props> = ({ completed }) => {
  const [stage, setStage] = useState(1);

  const next = () => {
    if (stage === 3) {
      completed();
    } else {
      setStage(stage + 1);
    }
  };

  let userSession = UserService.GetUserSession();
  let userSessionName = '';
  if (userSession) userSessionName = userSession.name;

  return (
    <AlphaContent>
      {stage === 0 && (
        <img className={style['transparent-logo']} src={transparentlogo} />
      )}
      {stage === 1 && (
        <div className={style['onboarding-container']}>
          <div>
            <IonImg src={wavinghand} className={style['wavinghand']} />
            <h1>Welcome to Profile</h1>
          </div>
          <div className={style['stage1-content']}>
            <div className={style['avatar-container']}>
              <IonImg
                src={defaultAdamAvatar}
                className={style['defaultAdamAvatar']}
              />
              <p className={style['name']}>{userSessionName}</p>
              <p>Profile is being published...</p>
            </div>
            <p>
              Keep an eye on your profile status. It is
              <span style={{ color: '#FF5A5A', fontWeight: 'bold' }}>
                {' '}
                red{' '}
              </span>
              at the moment because your DID is still being published. Once this
              is
              <span style={{ color: '#4C6FFF', fontWeight: 'bold' }}>
                {' '}
                blue,
              </span>
              you can access your profile manager to add content to your
              profile.
            </p>
          </div>

          <IonButton className={style['nextBtn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {stage === 2 && (
        <div className={style['onboarding-container']}>
          <div>
            <IonImg src={lockicon} className={style['wavinghand']} />
            <h1>Your Responsibility</h1>
          </div>
          <div className={style['stage2-content']}>
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

          <IonButton className={style['nextBtn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {stage === 3 && (
        <div className={style['onboarding-container']}>
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
          <IonButton className={style['nextBtn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
    </AlphaContent>
  );
};

export default OnBoardingPage;
