import { mapDispatchToProps, mapStateToProps } from './index';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export type LocationState = {
  name: string;
  email: string;
  password: string;
};
