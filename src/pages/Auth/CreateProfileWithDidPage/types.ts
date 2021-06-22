import { SubState } from 'src/store/users/types';
import { mapDispatchToProps, mapStateToProps } from './index';

export type { SubState };

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export type UserType = {
  name: string;
  loginCred: LoginCred;
};

export type LocationState = {
  from: Location;
  did: string;
  mnemonic: string;
  user?: UserType;
};
