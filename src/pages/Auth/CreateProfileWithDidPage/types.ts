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
