export type UserType = {
  name: string;
  loginCred: LoginCred;
};

export type LocationState = {
  from: Location;
  user?: UserType;
};
