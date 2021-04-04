import React from 'react';
import { IonText } from '@ionic/react';

import style from './PrimaryButton.module.scss';

interface Props {
  onClick?: () => void;
  text?: string;
  mt?: number;
  disabled?: boolean;
}

const PrimaryButton: React.FC<Props> = ({
  onClick,
  text,
  mt,
  disabled = false
}) => {
  const cName = style['btn-primary'];

  return (
    <div
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      className={cName}
      style={{
        marginTop: mt && `${mt}px`,
        opacity: disabled ? 0.2 : 1
      }}
    >
      <IonText>{text}</IonText>
    </div>
  );
};

export default PrimaryButton;
