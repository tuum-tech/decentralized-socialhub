/**
 * Type defined inside this container
 */
import { AccountType } from 'src/services/user.service';

import { initialState } from './reducer';
import { mapDispatchToProps, mapStateToProps } from './index';
import { Actions } from './constants';

export type SubState = typeof initialState;
export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>;

export type ActionType = typeof Actions;

export type UserProps = {
  status: string;
  did: string;
  email: string;
  _id: string;
};

export type SessionProp = {
  id: string;
  users: Array<UserProps>;
  name: string;
  email: string;
  request_token: string;
  credential: string;
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
    | AccountType.Email;
};

export type LocationState = {
  from: Location;
  users: Array<UserProps>;
  id: string;
  name: string;
  email: string;
  request_token: string;
  credential: string;
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
    | AccountType.Email;
};
