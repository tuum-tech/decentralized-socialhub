
import { AccountType } from 'src/services/user.service';

export type LocationState = {
  from: Location;
  name: string;
  userToken: string;
  accountType:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
    | AccountType.Github
    | AccountType.Discord;
  did: string;
  hiveHost: string;
  isDIDPublished: boolean;
  didPublishTime: number;
  loginCred: LoginCred;
};


import { SubState, ActionType, defaultUserInfo } from 'src/store/users/types';
import { mapDispatchToProps, mapStateToProps } from './index';

export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export { defaultUserInfo }; 
export type { SubState, ActionType };



