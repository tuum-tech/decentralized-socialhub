import { Actions } from './constants';
import { AccountType } from 'src/services/user.service';

export type ActionType = typeof Actions;

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
