import { mapDispatchToProps, mapStateToProps } from './index';
import { SubState, ActionType } from 'src/store/templates/types';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;


export type { SubState, ActionType };


