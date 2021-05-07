interface ExperienceItem {
  guid: Guid;
  isEnabled: boolean;
  institution: string;
  program: string;
  start: string;
  end: string;
  still: boolean;
  isVerified: boolean;
  title: string;
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}

interface ExperienceDTO {
  isEnabled: boolean;
  items: ExperienceItem[];
}

interface EducationItem {
  guid: Guid;
  isEmpty: boolean;
  institution: string;
  program: string;
  start: string;
  end: string;
  still: boolean;
  isVerified: boolean;
  title: string;
  description: string;
  order: string;
  logo?: string;
}

interface ActivityItem {
  guid: Guid;
  did: string;
  message: string;
  read: boolean;
}

interface EducationDTO {
  isEnabled: boolean;
  items: EducationItem[];
}

interface AddressDTO {
  street_name: string;
  number: string;
  state: string;
  country: string;
  postal_code: string;
}

interface BasicDTO {
  isEnabled: boolean;
  name: string;
  email: string;
  hiveHost: string;
  did: string;
  about: string;
  title: string;
  address: AddressDTO;
}

interface ProfileDTO {
  basicDTO: BasicDTO;
  experienceDTO: ExperienceDTO;
  educationDTO: EducationDTO;
}

interface ISessionItem {
  hiveHost: string;
  userToken: string;
  accountType: AccountType;
  did: string;
  name: string;
  email?: string;
  isDIDPublished: boolean;
  mnemonics: string;
  passhash: string;
  tutorialStep: number;
  onBoardingCompleted: boolean;
  loginCred?: LoginCred;
  badges?: IBadges;
  avatar?: string;
  code?: string;
  status?: string;
}

interface LoginCred {
  linkedin?: string;
  google?: string;
  twitter?: string;
  facebook?: string;
  email?: string;
}

interface PeopleItem {
  name: string;
  did: string;
  avatar?: string;
}

interface PeopleDTO {
  items: PeopleItem[];
}

interface PageItem {
  name: string;
  did?: string;
  avatar?: string;
}

interface PageDTO {
  items: PageItem[];
}

interface FollowingItem {
  did: string;
  // followers?: string;
}

interface FollowingDTO {
  items: FollowingItem[];
}

interface IFollowingResponse {
  _status?: string;
  get_following: IGetFollowing;
}

interface IGetFollowing {
  items: IFollowingItem[];
}

interface IFollowingItem {
  _id?: { $oid: string };
  created?: { $date: string };
  did: string;
  modified?: { $date: string };
  followers?: string;
}

interface IFollowerResponse {
  _status?: string;
  get_followers: IGetFollowersBody;
}

interface IGetFollowersBody {
  items: IFollowerItem[];
}

interface IFollowerItem {
  did: string;
  name: string;
  followers: string[];
}

interface IBadges {
  account: AccountBadgeItem;
  socialVerify: SocialBadgeItem;
  didPublishTimes: DIDBadgeItem;
  dStorage: DStorageBadgeItem;
}

interface AccontBadgeItem {
  beginnerTutorial: BadgeArchiveModel;
  basicProfile: BadgeArchiveModel;
  educationProfile: BadgeArchiveModel;
  experienceProfile: BadgeArchiveModel;
}

interface SocialBadgeItem {
  linkedin: BadgeArchiveModel;
  facebook: BadgeArchiveModel;
  twitter: BadgeArchiveModel;
  google: BadgeArchiveModel;
  email: BadgeArchiveModel;
  phone: BadgeArchiveModel;
}
interface DIDBadgeItem {
  _1times: BadgeArchiveModel;
  _5times: BadgeArchiveModel;
  _10times: BadgeArchiveModel;
  _25times: BadgeArchiveModel;
  _50times: BadgeArchiveModel;
  _100times: BadgeArchiveModel;
}
interface DStorageBadgeItem {
  ownVault: BadgeArchiveModel;
}

interface BadgeArchiveModel {
  archived: number | boolean;
}
