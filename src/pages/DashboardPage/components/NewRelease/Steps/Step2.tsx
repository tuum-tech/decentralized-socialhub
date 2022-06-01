import React from 'react';
import { IonRow, IonGrid } from '@ionic/react';

import style from '../style.module.scss';
import MortarSvg from '../../../../../assets/release/mortar.svg';
import MuscleSvg from '../../../../../assets/release/muscle.svg';
import SettingSvg from '../../../../../assets/release/setting.svg';

const Step2Component: React.FC = () => {
  return (
    <IonGrid className={style['step2']}>
      <IonRow className={style['item']}>
        <img alt="logo" src={MortarSvg} />
        <p className={style['item-left']}>
          NFT Introduced, Now showcase your NFTs under your profile.
        </p>
      </IonRow>
      <IonRow className={style['item']}>
        <img alt="logo" src={SettingSvg} />
        <p className={style['item-left']}>
          Runs natively on Apple Silicon devices. Experience faster load times,
          smoother navigation, and quick rendering.
        </p>
      </IonRow>
      <IonRow className={style['item']}>
        <img alt="logo" src={MuscleSvg} />
        <p className={style['item-left']}>
          Automatically select a portion of your image as you hover over it and
          click. Saves time while making complex edits and delivers faster
          results.
        </p>
      </IonRow>
    </IonGrid>
  );
};

export default Step2Component;
