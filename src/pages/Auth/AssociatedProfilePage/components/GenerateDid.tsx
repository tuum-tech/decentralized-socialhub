import React, { useState } from 'react';
import { AccountType } from 'src/services/user.service';

import SetPassword from '../../components/SetPassword';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service';

interface Props {
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

const GenerateDid: React.FC<Props> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [loading, setLoading] = useState(false);
  const { name, loginCred, service, credential } = props;

  let userService = new UserService(new DidService());

  return (
    <SetPassword
      loading={loading}
      next={async pwd => {
        setLoading(true);
        await userService.CreateNewUser(
          name,
          service,
          loginCred,
          credential,
          pwd,
          '',
          '',
          ''
        );
        window.location.href = '/profile';
        setLoading(false);
      }}
    />
  );
};

export default GenerateDid;
