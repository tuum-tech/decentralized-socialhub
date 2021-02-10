import React from 'react';
import { IonText, IonImg } from '@ionic/react';

import style from './ButtonWithLogo.module.scss';
import whitelogo from '../../assets/logo/whitelogo.png';

interface Props {
  onClick?: () => void;
  text?: string;
  mt?: number;
  dark?: boolean;
}

const ButtonWithLogo: React.FC<Props> = ({ onClick, text, mt, dark }) => {
  let cName = dark
    ? `${style['dark-mode']} ${style['logo-btn']}`
    : style['logo-btn'];

  return (
    <div
      onClick={onClick}
      className={cName}
      style={{
        marginTop: mt && `${mt}px`,
      }}
    >
      <IonImg src={whitelogo} style={{ maxWidth: '25.29px' }} />
      <IonText className={style['logo-btn_txt']}>{text}</IonText>
    </div>
  );
};

export default ButtonWithLogo;
