/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticContext } from 'react-router';

import { UserService, AccountType, UserData } from 'src/services/user.service';
import SetPassword from 'src/components/SetPassword';

type LocationState = {
  from: Location;
  id: string;
  name: string;
  request_token: string;
  email: string;
  create_new?: number;
  service:
    | AccountType.DID
    | AccountType.Linkedin
    | AccountType.Facebook
    | AccountType.Google
    | AccountType.Twitter;
};

const GenerateDID: React.FC<
  RouteComponentProps<{}, StaticContext, LocationState>
> = (props) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */

  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(false);
  const [prevUsers, setPrevUsers] = useState<UserData[]>([]);

  const {
    id,
    name,
    request_token,
    email,
    create_new = 0,
    service,
  } = props.location.state;

  useEffect(() => {
    (async () => {
      if (id !== '' && name !== '' && request_token !== '' && email !== '') {
        const pUsers = await UserService.getPrevDiD(id, AccountType.Google);
        setPrevUsers(pUsers);
      }
    })();
  }, []);

  const loginToProfile = async (pwd: string = '') => {
    await UserService.NewSignIn3rdParty(
      id,
      name,
      request_token,
      service,
      email,
      pwd,
      true
    );
    setLoading(false);
    setIsLogged(true);
  };

  const getRedirect = () => {
    if (isLogged) {
      return <Redirect to={{ pathname: '/profile' }} />;
    }
    if (!create_new && prevUsers.length > 0) {
      const didUserStr = prevUsers[prevUsers.length - 1].did.replace(
        'did:elastos:',
        ''
      );
      return (
        <Redirect
          to={{
            pathname: '/create/associated-profile',
            state: {
              did: didUserStr,
              id,
              name,
              request_token,
              email,
              service: AccountType.Google,
            },
          }}
          push={true}
        />
      );
    }
    return (
      <SetPassword
        next={async (pwd) => {
          setLoading(true);
          await loginToProfile(pwd);
        }}
        displayText={loading ? 'Encrypting now.......' : ''}
      />
    );
  };
  return getRedirect();
};

export default withRouter(GenerateDID);
