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

  const getDataFromOpenLoginStore = (): any => {
    let result = {
      accountType: AccountType.DID,
      imageUrl: '',
      loginCred: {}
    };
    const openloginStore = JSON.parse(
      window.localStorage.getItem('openlogin_store') || '{}'
    );
    let typeOfLogin = '';
    if (openloginStore) {
      typeOfLogin = openloginStore.typeOfLogin || '';
      result.imageUrl = openloginStore.profileImage || '';
      result.loginCred =
        typeOfLogin !== ''
          ? {
              [typeOfLogin]: openloginStore?.verifierId || ''
            }
          : {};
    }
    switch (typeOfLogin) {
      case 'google':
        result.accountType = AccountType.Google;
        break;
      case 'facebook':
        result.accountType = AccountType.Facebook;
        break;
      case 'twitter':
        result.accountType = AccountType.Twitter;
        break;
      case 'linkedin':
        result.accountType = AccountType.Linkedin;
        break;
      case 'github':
        result.accountType = AccountType.Github;
        break;
      case 'reddit':
        result.accountType = AccountType.Reddit;
        break;
      case 'discord':
        result.accountType = AccountType.Discord;
        break;
      case 'twitch':
        result.accountType = AccountType.Twitch;
        break;
      case 'apple':
        result.accountType = AccountType.Apple;
        break;
      case 'line':
        result.accountType = AccountType.Line;
        break;
      case 'kakao':
        result.accountType = AccountType.Kakao;
        break;
      case 'weibo':
        result.accountType = AccountType.Weibo;
        break;
      case 'wechat':
        result.accountType = AccountType.Wechat;
        break;
      case 'email_passwordless':
        result.accountType = AccountType.Email;
        break;
      default:
        result.accountType = AccountType.DID;
    }
    return result;
  };

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
        } = getDataFromOpenLoginStore();

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
