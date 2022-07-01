import React, { useEffect } from 'react';
import { StaticContext, RouteComponentProps, useHistory } from 'react-router';

import { LocationState } from './types';

import { UserService } from 'src/services/user.service';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { AccountType } from 'src/services/user.service';
import useSession from 'src/hooks/useSession';

import { DidService } from 'src/services/did.service.new';
import axios from 'axios';

interface PageProps
  extends RouteComponentProps<{}, StaticContext, LocationState> {}

const GenerateDidPage: React.FC<PageProps> = (props: PageProps) => {
  const history = useHistory();
  const { setSession } = useSession();

  const getBase64FromImageUrl = async (imageUrl: string): Promise<any> => {
    let image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    let raw = Buffer.from(image.data).toString('base64');
    return 'data:' + image.headers['content-type'] + ';base64,' + raw;
  };

  useEffect(() => {
    (async () => {
      if (props.location.state) {
        const session = props.location.state;
        let userService = new UserService(await DidService.getInstance());

        if (session.did && !session.did.startsWith('did:elastos:')) {
          session.did = '';
          session.service = AccountType.DID;
        }

        const {
          accountType,
          imageUrl,
          loginCred
        } = UserService.getDataFromOpenLoginStore();

        console.log('Moralis User Attributes: ', session.userAttributes);
        console.log('Account Type: ', accountType);
        console.log('imageUrl: ', imageUrl);
        console.log('LoginCred: ', loginCred);

        const avatar = await getBase64FromImageUrl(imageUrl);

        let sessionItem = await userService.CreateNewUser(
          session.name,
          accountType,
          loginCred,
          session.credential,
          session.did,
          process.env.REACT_APP_TUUM_TECH_HIVE || '',
          avatar,
          ''
        );
        setSession(sessionItem);
        history.push('/profile');
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <LoadingIndicator />;
};

export default GenerateDidPage;
