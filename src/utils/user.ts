import { DidService } from 'src/services/did.service.new';

export type UserType = {
  did: string;
  mnemonic: string;
  name: string;
  hiveHost: string;
  loginCred: LoginCred;
  avatar: string;
};

export const retrieveDocInfo = async (
  did: string,
  mnemonic: string,
  name = '',
  email = ''
) => {
  let didService = new DidService();
  let doc = await didService.getDidDocument(did);
  let uInfo: UserType = {
    did,
    mnemonic,
    name: name,
    hiveHost: '',
    loginCred: {
      email: email
    },
    avatar: ''
  };
  if (doc && doc !== undefined) {
    if (doc.credentials && doc.credentials.size > 0) {
      let loginCred: any = {};
      doc.credentials.forEach((value, key) => {
        let subject = value.id.getFragment();
        let properties = value.subject.getProperties();
        let propertieValue = properties[subject];
        switch (subject) {
          case 'name':
            uInfo.name = propertieValue as string;
            break;
          case 'email':
            loginCred.email = propertieValue as string;
            break;
          case 'google':
            loginCred.google = propertieValue as string;
            break;
          case 'twitter':
            loginCred.twitter = propertieValue as string;
            break;
          case 'facebook':
            loginCred.facebook = propertieValue as string;
            break;
          case 'linkedin':
            loginCred.linkedin = propertieValue as string;
            break;
          case 'github':
            loginCred.github = propertieValue as string;
            break;
          case 'discord':
            loginCred.discord = propertieValue as string;
            break;
          case 'avatar':
            let avatarObject = JSON.parse(propertieValue.toString());
            let baseStr = avatarObject['data'];
            if (!baseStr.startsWith('data:image/')) {
              baseStr = `data:${avatarObject['content-type']};base64,${baseStr}`;
            }
            uInfo.avatar = baseStr;
            break;

          default:
            break;
        }
      });

      uInfo.loginCred = loginCred;
    }

    if (doc.services && doc.services.size > 0) {
      let firstService = doc.services.entries().next().value;
      uInfo.hiveHost = firstService.endpoint;
    }
  }

  uInfo.name = '';
  uInfo.loginCred.email = '';
  return uInfo;
};
