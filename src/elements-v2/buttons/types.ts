import React from 'react';
import { IonIconType } from '../icons/types';

export interface ButtonProps {
  size?: 'default' | 'large' | 'small' | undefined;
  color?: 'primary' | 'secondary' | 'gradient';
  variant?: 'text' | 'outlined' | 'contained';
  textType?: 'normal' | 'gradient';
  width?: string;
  height?: string;
  bgColor?: string;
  borderRadius?: string;
  borderColor?: string;
  icon?: IonIconType;
  children: React.ReactNode;
}
