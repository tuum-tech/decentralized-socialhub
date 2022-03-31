import { initialState } from './reducer';
import { Actions } from './constants';

export type SubState = typeof initialState;

export type ActionType = typeof Actions;

export const defaultUserInfo: ISessionItem = {
  hiveHost: '',
  userToken: '',
  accountType: 'DID',
  did: '',
  // email: '',
  name: '',
  isDIDPublished: false,
  didPublishTime: 0,
  loginCred: {},
  mnemonics: '',
  passhash: '',
  onBoardingCompleted: false,
  tutorialStep: 1,
  pageTemplate: 'default',
  timestamp: Date.now()
};

export const defaultBadges: IBadges = {
  account: {
    beginnerTutorial: { archived: false },
    basicProfile: { archived: false },
    educationProfile: { archived: false },
    experienceProfile: { archived: false }
  },
  socialVerify: {
    linkedin: { archived: false },
    facebook: { archived: false },
    twitter: { archived: false },
    google: { archived: false },
    github: { archived: false },
    discord: { archived: false },
    email: { archived: false },
    phone: { archived: false }
  },
  didPublishTimes: {
    _1times: { archived: false },
    _5times: { archived: false },
    _10times: { archived: false },
    _25times: { archived: false },
    _50times: { archived: false },
    _100times: { archived: false }
  },
  dStorage: {
    ownVault: { archived: false }
  }
};
