import React, { useState } from 'react';
import { AccountType } from 'src/services/user.service';

import SetPassword from '../../components/SetPassword';
import { UserService } from 'src/services/user.service';

interface Props {
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
}

const GenerateDid: React.FC<Props> = props => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [loading, setLoading] = useState(false);
  const { name, email, request_token, service, credential } = props;

  return (
    <SetPassword
      loading={loading}
      next={async pwd => {
        setLoading(true);
        await UserService.CreateNewUser(
          name,
          request_token,
          service,
          email,
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
