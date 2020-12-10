import React from 'react';
import { IonSpinner, IonContent } from '@ionic/react';
import style from './style.module.scss';

const VaultProgressComponent: React.FC<{ stage: string }> = ({ stage }) => {
  return (
    <IonContent className={style["vaultprogresscomponent"]}>
      {/*-- Default VaultProgressComponent --*/}
      <div className={style["header"]}>
        <div className={style["header-container"]}>
          <span className={stage == 'choose' ? style["header-item"] + ' ' + style["active"] : style["header-item"]}><b>•</b>&nbsp;Choose</span>
          <span className={stage == 'signin' ? style["header-item"] + ' ' + style["active"] : style["header-item"]}><b>•</b>&nbsp;Sign in</span>          
          <span className={stage == 'create' ? style["header-item"] + ' ' + style["active"] : style["header-item"]}><b>•</b>&nbsp;Create</span>          
          <span className={stage == 'publish' ? style["header-item"] + ' ' + style["active"] : style["header-item"]}><b>•</b>&nbsp;Publish</span>
        </div>
      </div>
    </IonContent>
  )
};

export default VaultProgressComponent;
