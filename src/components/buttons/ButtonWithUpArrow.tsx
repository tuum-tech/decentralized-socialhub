import React from 'react';
import { IonText, IonImg } from '@ionic/react';

import style from './ButtonWithUpArrow.module.scss';
import whiteuparrow from '../../assets/icon/box-arrow-up-right.svg';

interface Props {
  onClick?: () => void;
  text?: string;
  mt?: number;
  dark?: boolean;
}

const ButtonWithUpArrow: React.FC<Props> = ({ onClick, text, mt, dark }) => {
  let cName = dark
    ? `${style['dark-mode']} ${style['up-arrow-btn']}`
    : style['up-arrow-btn'];

  return (
    <div
      onClick={onClick}
      className={cName}
      style={{
        marginTop: mt && `${mt}px`,
      }}
    >
      <IonImg src={whiteuparrow} />
      <IonText className={style['up-arrow-btn_txt']}>{text}</IonText>
    </div>
  );
};

export default ButtonWithUpArrow;
