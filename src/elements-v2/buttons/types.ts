import { AnimationBuilder } from '@ionic/react';
import { CSSProperties, ReactNode } from 'react';
import { IonIconType } from '../icons/types';

export interface ButtonProps {
  size?: 'default' | 'large' | 'small' | undefined;
  disabled?: boolean;
  loading?: boolean;
  btnColor?:
    | 'primary'
    | 'secondary'
    | 'white'
    | 'primary-gradient'
    | 'secondary-gradient'
    | 'light-gradient';
  variant?: 'text' | 'outlined' | 'contained';
  textType?: 'normal' | 'gradient';
  bgColor?: string;
  borderRadius?: string;
  borderColor?: string;
  icon?: IonIconType | null;
  style?: CSSProperties;
  className?: string;
  children: ReactNode;
}

export interface DefaultButtonProps {
  onClick?: () => void;
  loading?: boolean;
}

export interface LinkButtonProps {
  href?: string | undefined;
  target?: string | undefined;
  routerAnimation?: AnimationBuilder | undefined;
  rel?: string | undefined;
}
