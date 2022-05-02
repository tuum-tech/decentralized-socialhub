import { Guid } from 'guid-typescript';
import { DidService } from 'src/services/did.service.new';
import { defaultEducationItem } from 'src/components/cards/EducationCard';
import { defaultExperienceItem } from 'src/components/cards/ExperienceCard';
import { DIDURL } from '@elastosfoundation/did-js-sdk/';

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
  let didService = await DidService.getInstance();
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

  let educations: EducationItem[] = [];
  let experiences: ExperienceItem[] = [];
  if (doc && doc !== undefined) {
    if (doc.credentials && doc.credentials.size > 0) {
      let loginCred: any = {};

      doc.credentials.forEach(value => {
        let fragment = value.id.getFragment().toLowerCase();
        let subject = fragment.split('credential')[0];
        let properties = value.subject.getProperties();
        let propertieValue: any = properties[fragment];

        switch (subject) {
          case 'name':
            if (fragment === 'namecredential') {
              uInfo.name = propertieValue.name as string;
            } else {
              uInfo.name = propertieValue as string;
            }
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
            let avatarObject = JSON.parse(JSON.stringify(propertieValue));
            let baseStr = avatarObject['data'];
            if (!baseStr.startsWith('data:image/')) {
              baseStr = `data:${avatarObject['content-type']};base64,${baseStr}`;
            }
            uInfo.avatar = baseStr;
            break;
          case 'education':
            let education = {
              ...defaultEducationItem,
              ...propertieValue,
              guid: Guid.create(),
              still: !propertieValue.end
            };
            educations.push(education);
            break;
          case 'experience':
            let experience = {
              ...defaultExperienceItem,
              ...propertieValue,
              guid: Guid.create(),
              still: !propertieValue.end
            };
            experiences.push(experience);
            break;
          default:
            break;
        }
      });

      uInfo.loginCred = loginCred;
    }

    let serviceEndpoint = '';
    let hiveUrl = new DIDURL(did + '#hivevault');
    if (doc.services?.has(hiveUrl)) {
      serviceEndpoint = doc.services.get(hiveUrl).serviceEndpoint;
    } else {
      hiveUrl = new DIDURL(did + '#HiveVault');
      if (doc.services?.has(hiveUrl)) {
        serviceEndpoint = doc.services.get(hiveUrl).serviceEndpoint;
      }
    }
    if (serviceEndpoint) {
      uInfo.hiveHost = serviceEndpoint;
    }
  }
  educations = educations.filter((itr1, index) => {
    return (
      educations.findIndex(
        itr2 =>
          itr1.institution === itr2.institution &&
          itr1.description === itr2.description &&
          itr1.program === itr2.program &&
          itr1.start === itr2.start &&
          itr1.end === itr2.end
      ) === index
    );
  });
  experiences = experiences.filter((itr1, index) => {
    return (
      experiences.findIndex(
        itr2 =>
          itr1.institution === itr2.institution &&
          itr1.description === itr2.description &&
          itr1.title === itr2.title &&
          itr1.start === itr2.start &&
          itr1.end === itr2.end
      ) === index
    );
  });
  return { uInfo, experiences, educations };
};
