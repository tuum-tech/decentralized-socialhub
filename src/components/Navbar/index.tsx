import React from 'react';
import { IonContent } from '@ionic/react';
import style from './style.module.scss';

const Navbar: React.FC = () => {
  return (
    <IonContent>
      <div className={style["navbar"]}>
        <p>
          How it works?
          <a href="https://twitter.com/TuumTech"><img src="../../assets/topnav_instagram.svg" /></a>
          <a href="https://twitter.com/TuumTech"><img src="../../assets/topnav_twitter.svg" /></a>
          <a href="https://twitter.com/TuumTech"><img src="../../assets/topnav_facebook.svg" /></a>
        </p>

      </div>
    </IonContent>
  )
};

export default Navbar;
