/**
 * Page
 */
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps, withRouter } from 'react-router-dom';
import { StaticContext } from 'react-router';

import { UserService, AccountType, UserData } from 'src/services/user.service';
import SetPassword from 'src/components/SetPassword';
import { checkIfEmailAlreadyRegistered } from './fetchapi';

type LocationState = {
  from: Location;
  id: string;
  fname: string;
  lname: string;
  email: string;
  request_token: string;
  credential: string;
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
  const [prevUser, setPrevUser] = useState<UserData>();

  const {
    fname,
    lname,
    email,
    id,
    request_token,
    service,
    credential,
  } = props.location.state;

  useEffect(() => {
    (async () => {
      if (fname !== '' && lname !== '' && email !== '') {
        const prevUser = await checkIfEmailAlreadyRegistered(email, service);
        setPrevUser(prevUser);
      }
    })();
  }, []);

  const loginToProfile = async (pwd: string = '') => {
    await UserService.SignIn3rdParty(
      id,
      fname,
      lname,
      request_token,
      service,
      email,
      credential,
      pwd
    );
    setLoading(false);
    setIsLogged(true);
  };

  const getRedirect = () => {
    if (isLogged) {
      return <Redirect to={{ pathname: '/profile' }} />;
    }
    if (prevUser) {
      const didUserStr = prevUser.did.replace('did:elastos:', '');
      return (
        <Redirect
          to={{
            pathname: '/create/associated-profile',
            state: {
              did: didUserStr,
              id,
              firstName: fname,
              lastName: lname,
              request_token,
              email,
              service,
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
