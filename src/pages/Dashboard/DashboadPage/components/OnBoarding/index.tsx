/**
 * Page
 */

import React, { useState } from 'react';
import { IonButton, IonImg } from '@ionic/react';

import { UserService } from 'src/services/user.service';
import AlphaContent from 'src/components/AlphaContent';

import transparentlogo from '../../../../../assets/logo/transparentlogo.png';
import wavinghand from '../../../../../assets/icon/wavinghand.png';
import defaultAdamAvatar from '../../../../../assets/icon/defaultAdamAvatar.png';
import emojiCool from '../../../../../assets/icon/emoji-cool.png';

import style from './style.module.scss';

interface Props {
  next: () => void;
  stage: number;
  userName: string;
}

const OnBoardingPage: React.FC<Props> = ({ next, userName, stage }) => {
  return (
    <AlphaContent>
      {stage === 1 && (
        <div className={style['onboarding-container']}>
          <div>
            <h1>Publishing in progress…</h1>
          </div>
          <p>
            Keep an eye on your profile status. It is
            <span style={{ color: '#FF5A5A', fontWeight: 'bold' }}> red </span>
            at the moment because your DID is still being published. Once this
            is
            <span style={{ color: '#4C6FFF', fontWeight: 'bold' }}> blue,</span>
            you can access your profile manager to add content to your profile.
          </p>

          <div className={style['stage3-content']}>
            <div className={style['avatar-container']}>
              <IonImg
                src={defaultAdamAvatar}
                className={style['defaultAdamAvatar']}
              />
              <p className={style['name']}>{userName}</p>
              <p>Publishing</p>
            </div>
          </div>
          <IonButton className={style['nextBtn']} onClick={next}>
            Continue
          </IonButton>
        </div>
      )}
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
              Only you know your secret keys(also called mnemonics) and your
              passwords. You control it, you own it and we do not store
              anything. This means you are responsible for protecting and
              securing your secret keys! These keys are used to issue your
              Decentralized Identifier(DID for short) so keep it in a safe
              place!!
            </p>

            <p>
              You can learn more about this later. Ready to see what your can do
              with your DID?
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
              <p className={style['name']}>{userName}</p>
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
      {stage === 4 && (
        <div className={style['onboarding-container']}>
          <div>
            <IonImg src={emojiCool} className={style['wavinghand']} />
            <h1>Next steps?</h1>
          </div>
          <div className={style['stage4-content']}>
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
