import React from 'react';
import { SubState, defaultUserInfo } from 'src/store/users/types';

export { defaultUserInfo }; 
export type { SubState };

export type MenuType = {
  title: string | React.ReactNode;
  tooltip?: string;
  name: string;
  active: boolean;
  rightContent?: React.ReactNode,
  isChild?: boolean;
  handleClick: () => void;
  items?: MenuType[];
};