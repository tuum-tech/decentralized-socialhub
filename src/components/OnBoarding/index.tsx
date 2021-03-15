/**
 * Page
 */

import React, { useState } from 'react';
import { IonButton, IonImg } from '@ionic/react';

import AlphaContent from '../AlphaContent';
import transparentlogo from '../../assets/logo/transparentlogo.png';
import wavinghand from '../../assets/icon/wavinghand.png';
import defaultAdamAvatar from '../../assets/icon/defaultAdamAvatar.png';
import emojiCool from '../../assets/icon/emoji-cool.png';

import style from './style.module.scss';

interface Props {
  completed: () => void;
}

const OnBoardingPage: React.FC<Props> = ({ completed }) => {
  const [stage, setStage] = useState(1);

  const next = () => {
    if (stage === 4) {
      completed();
    } else {
      setStage(stage + 1);
    }
  };

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

          <IonButton className={style['nextBtn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {stage === 2 && (
        <div className={style['onboarding-container']}>
          <div>
            <IonImg src={wavinghand} className={style['wavinghand']} />
            <h1>Your Responsibility</h1>
          </div>
          <div className={style['stage2-content']}>
            <p>
              There is no help with passwords or security in a decentralized
              world. You control it, you own it and it’s nothing to do with us.
              This means you need to be resonsable for it! We call it a
              Decentralized ID (DID for short).
            </p>

            <p>
              You can learn more about this later. Ready to see what your
              Decentralized ID looks like? Make sure no one else can see the
              next screen. Only you!
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
            <h1>Profile Status</h1>
          </div>
          <div className={style['stage3-content']}>
            <div className={style['avatar-container']}>
              <IonImg
                src={defaultAdamAvatar}
                className={style['defaultAdamAvatar']}
              />
              <p className={style['name']}>Adam Keywood</p>
              <p>Profile is being published...</p>
            </div>
            <p>
              You need to keep an eye on your profile status. It’s
              <span style={{ color: '#FF5A5A', fontWeight: 'bold' }}>
                {' '}
                red{' '}
              </span>
              at the moment meaning a transaction is taking place. Once this is
              <span style={{ color: '#4C6FFF', fontWeight: 'bold' }}>
                {' '}
                blue{' '}
              </span>
              you can access the profile manager to edit.
            </p>
          </div>
          <IonButton className={style['nextBtn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
      {stage === 4 && (
        <div className={style['onboarding-container']}>
          <div>
            <IonImg src={emojiCool} className={style['wavinghand']} />
            <h1>Next steps?</h1>
          </div>
          <div className={style['stage4-content']}>
            <p>
              You can edit your profile in the profile manager and explore other
              peoples in the explore section.
            </p>
            <p style={{ marginTop: '30px' }}>
              You can view your public profile by clicking on the button in the
              top right. This will launch a seperate window, and shows you what
              your profile looks like to others.
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
