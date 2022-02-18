import { atom } from 'recoil';
import { defaultFullProfile } from 'src/services/profile.service';
import { defaultUserInfo } from 'src/store/users/types';

export const DIDDocumentAtom = atom({
  key: 'DIDDocument',
  default: ''
});

export const SessionAtom = atom({
  key: 'Session',
  default: defaultUserInfo
});

export const FullProfileAtom = atom({
  key: 'FullProfile',
  default: defaultFullProfile as ProfileDTO
});
