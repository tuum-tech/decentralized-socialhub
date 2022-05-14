import { mapDispatchToProps, mapStateToProps } from './index';

export type UserType = {
  name: string;
  loginCred: LoginCred;
};

export type LocationState = {
  from: Location;
  user?: UserType;
};

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;
