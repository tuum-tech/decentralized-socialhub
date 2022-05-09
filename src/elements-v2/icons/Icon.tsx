import React, { FC, useMemo } from 'react';
import { IonIcon } from '@ionic/react';
import * as icons from 'ionicons/icons';
import { camelCase } from 'lodash';
import { IonIconType, ionIconTypes, IonIconKeyType } from './types';

export interface IconProps {
  name: IonIconType;
  style?: React.CSSProperties;
  color?: string;
  onClick?: () => void;
}

const Icon: FC<IconProps> = ({ name, style, color, onClick }: IconProps) => {
  const iconKey = useMemo<IonIconKeyType>(() => camelCase(name), [name]);

  return ionIconTypes.includes(name) ? (
    <IonIcon
      icon={icons[iconKey]}
      color={color}
      style={style}
      onClick={onClick}
    ></IonIcon>
  ) : (
    <></>
  );
};

export default Icon;
