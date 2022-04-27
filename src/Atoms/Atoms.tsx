import { atom } from 'recoil';
import { recoilPersist } from 'recoil-persist';
import { defaultFullProfile } from 'src/services/profile.service';
import { defaultBadges, defaultUserInfo } from 'src/store/users/types';

const { persistAtom } = recoilPersist();

export const DIDDocumentAtom = atom({
  key: 'DIDDocument',
  default: ''
});

export const SessionAtom = atom({
  key: 'Session',
  default: defaultUserInfo
});

export const BadgesAtom = atom({
  key: 'Badges',
  default: defaultBadges
});

export const FullProfileAtom = atom({
  key: 'FullProfile',
  default: defaultFullProfile as ProfileDTO
});

export const CallbackFromAtom = atom({
  key: 'CallbackFrom',
  default: null,
  effects_UNSTABLE: [persistAtom]
});

export const SyncSpaceAtom = atom({
  key: 'UpdateSpace',
  default: false,
})
