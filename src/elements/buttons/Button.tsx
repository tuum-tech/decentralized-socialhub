import React from 'react';
import { IonText, IonImg } from '@ionic/react';
import { style as typestyle } from 'typestyle';
import clsx from 'clsx';

import style from './Button.module.scss';

interface ButtonTypes {
  [key: string]: any;
}
const btnTypes: ButtonTypes = {
  primary: {
    bgColor: 'var(--theme-primary-blue)',
    color: 'var(--ion-color-medium)',
    hoverBg: 'var(--ion-color-light-tint)',
    hoverColor: 'var(--theme-primary-blue)'
  },
  secondary: {
    bgColor: 'var(--ion-color-light-tint)',
    color: 'var(--theme-primary-blue)',
    hoverBg: 'var(--theme-primary-blue)',
    hoverColor: 'var(--ion-color-medium)'
  }
};

interface Props {
  onClick?: () => void;
  type: string;
  text?: string;
  mt?: number;
  ml?: number;
  icon?: string;
  disabled?: boolean;
}

const Button: React.FC<Props> = ({
  onClick,
  type = 'primary',
  text,
  mt,
  ml,
  icon,
  disabled = false
}) => {
  const shapeStyle = style['btn-primary'];
  const color = btnTypes[type].color;
  const bgColor = btnTypes[type].bgColor;

  const colorStyle = typestyle({
    marginTop: mt && `${mt}px`,
    marginLeft: ml && `${ml}px`,
    opacity: disabled ? 0.2 : 1,
    color: color,
    backgroundColor: bgColor,
    $nest: {
      '&:hover': {
        opacity: 0.8,
        cursor: 'pointer'
      }
    }
  });
  return (
    <div
      onClick={() => {
        if (!disabled && onClick) {
          onClick();
        }
      }}
      className={clsx(shapeStyle, colorStyle)}
    >
      {icon && (
        <IonImg
          src={icon}
          style={{ maxWidth: '25.29px', marginRight: '5px', color: color }}
        />
      )}
      <IonText>{text}</IonText>
    </div>
  );
};

export default Button;
