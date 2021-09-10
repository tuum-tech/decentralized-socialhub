import { UserService } from '../services/user.service';
import { DidService } from 'src/services/did.service.new';
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

export const getAvatarIfno = async (did: string): Promise<AvatarInterface> => {
  let userService: UserService = new UserService(
    await DidService.getInstance()
  );
  const tuumUser = await userService.SearchUserWithDID(did);

  let res = {
    avatar: '',
    type: 'default',
    name: tuumUser ? tuumUser.name : 'Anonymous',
    didPublished: tuumUser && tuumUser.tutorialStep === 4
  };

  // const userDoc = await DidDocumentService.getUserDocumentByDid(did);
  // if (userDoc) {
  //   if (userDoc.avatar) {
  //     res.avatar = userDoc.avatar
  //     res.type = 'didDoc'
  //   }
  //   if (userDoc.name) {
  //     res.name =userDoc.name
  //   }
  // } else

  if (tuumUser.avatar) {
    res.type = 'vault';
    res.avatar = tuumUser.avatar;
  }

  res.name = shortName(res.name);
  return res;
};
