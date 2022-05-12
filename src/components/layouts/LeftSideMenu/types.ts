import React from 'react';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export { defaultUserInfo }; 
export type { SubState, ActionType };

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