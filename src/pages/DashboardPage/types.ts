

import { mapStateToProps, mapDispatchToProps } from './index';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;


export { defaultUserInfo }; 
export type { SubState, ActionType };




