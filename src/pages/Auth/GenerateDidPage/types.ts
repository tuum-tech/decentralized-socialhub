import Moralis from 'moralis/types';
import { AccountType } from 'src/services/user.service';

export type LocationState = {
  from: Location;
  did: string;
  name: string;
  loginCred: LoginCred;
  credential: string;
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter
    | AccountType.Github
    | AccountType.Discord
    | AccountType.Email;
  userAttributes: Moralis.Attributes;
};

export type UserSessionProp = {
  did: string;
  name: string;
  loginCred: LoginCred;
  credential: string;
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
