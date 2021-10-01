import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';
export interface AvatarInterface {
  didPublished: boolean;
  avatar: string;
  type: string;
  name: string;
}

export const defaultAvatar: AvatarInterface = {
  type: 'default',
  name: 'Anonymous',
  avatar: '',
  didPublished: true
};

const shortName = (name: string) => {
  const names = name.split(' ');
  let res = '';
  if (names.length > 1) {
    res = names[0][0] + names[1][0];
  } else {
    res = names[0][0] + names[0][1];
  }
  return res.toUpperCase();
};

export const getAvatarIfno = async (
  did: string,
  fromDid: boolean
): Promise<AvatarInterface> => {
  let userService: UserService = new UserService(
    await DidService.getInstance()
  );
  const tuumUser = await userService.SearchUserWithDID(did);

  let avatar = '';
  let type = 'default';
  let name = 'Anonymous';
  let didPublished = false;

  if (fromDid) {
    let doc: DIDDocument = await (
      await DidService.getInstance()
    ).getDidDocument(did);
    if (doc && doc !== undefined) {
      if (doc.credentials && doc.credentials.size > 0) {
        let loginCred: any = {};
        doc.credentials.forEach((value, key) => {
          let subject = value.id.getFragment();
          let properties = value.subject.getProperties();
          let propertieValue = properties[subject];
          switch (subject) {
            case 'name':
              name = propertieValue as string;
              break;
            case 'avatar':
              let avatarObject = JSON.parse(propertieValue.toString());
              let baseStr = avatarObject['data'];
              if (!baseStr.startsWith('data:image/')) {
                baseStr = `data:${avatarObject['content-type']};base64,${baseStr}`;
              }
              avatar = baseStr;
              type = 'didDoc';
              break;
            default:
              break;
          }
        });
      }
    }
  } else if (
    tuumUser &&
    tuumUser.did !== '' &&
    tuumUser.avatar &&
    tuumUser.avatar !== ''
  ) {
    avatar = tuumUser.avatar;
    type = 'vault';
    name = tuumUser.name;
  }

  name = shortName(name);
  return { name, avatar, type, didPublished };
};
