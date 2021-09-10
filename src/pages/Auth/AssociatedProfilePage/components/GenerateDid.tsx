import React, { useState } from 'react';

import { UserService, AccountType } from 'src/services/user.service';

import SetPassword from '../../components/SetPassword';
import { DidService } from 'src/services/did.service.new';
import { Redirect } from 'react-router';

interface Props {
  afterPasswordSet: (res: ISessionItem) => void;
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
}

const GenerateDid: React.FC<Props> = ({
  afterPasswordSet,
  name,
  loginCred,
  service,
  credential
}: Props) => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(0);

  if (status === 1) {
    return <Redirect to="/profile" />;
  }

  return (
    <SetPassword
      loading={loading}
      next={async pwd => {
        setLoading(true);
        let userService = new UserService(await DidService.getInstance());
        const sessionItem = await userService.CreateNewUser(
          name,
          service,
          loginCred,
          credential,
          pwd,
          '',
          '',
          ''
        );
        setLoading(false);

        afterPasswordSet(sessionItem);
        setStatus(1);
      }}
    />
  );
};

export default GenerateDid;
