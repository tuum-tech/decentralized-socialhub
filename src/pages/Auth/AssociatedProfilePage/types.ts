import { mapDispatchToProps, mapStateToProps } from './index';
import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';
import { AccountType } from 'src/services/user.service';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export { defaultUserInfo }; 
export type { SubState, ActionType };

export type UserProps = {
  status: string;
  did: string;
  loginCred: LoginCred;
  _id: string;
};

export type SessionProp = {
  id: string;
  users: Array<UserProps>;
  name: string;
  loginCred: LoginCred;
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
    | AccountType.Github
    | AccountType.Discord
    | AccountType.Email;
};

export type LocationState = {
  from: Location;
  users: Array<UserProps>;
  id: string;
  name: string;
  loginCred: LoginCred;
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
    | AccountType.Github
    | AccountType.Discord
    | AccountType.Email;
};
