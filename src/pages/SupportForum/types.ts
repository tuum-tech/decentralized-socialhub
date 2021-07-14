import { mapDispatchToProps, mapStateToProps } from './index';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
