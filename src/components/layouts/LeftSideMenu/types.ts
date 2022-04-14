import { mapDispatchToProps, mapStateToProps } from './index';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export { defaultUserInfo }; 
export type { SubState, ActionType };

export type MenuType = {
  title: string | React.ReactNode;
  name: string;
  active: boolean;
  badge?: number;
  handleClick: () => void;
  items?: MenuType[];
};