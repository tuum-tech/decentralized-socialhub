interface TeamItem {
  guid: Guid;
  name: string;
  start: string;
  end: string;
  still: boolean;
  verifiers: {
    name: string;
    did: string;
  }[];
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface TeamDTO {
  isEnabled: boolean;
  items: TeamItem[];
}
interface ThesisItem {
  guid: Guid;
  title: string;
  publish: string;
  still: boolean;
  verifiers: {
    name: string;
    did: string;
  }[];
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface ThesisDTO {
  isEnabled: boolean;
  items: ThesisItem[];
}
interface PaperItem {
  guid: Guid;
  title: string;
  publish: string;
  still: boolean;
  verifiers: {
    name: string;
    did: string;
  }[];
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface PaperDTO {
  isEnabled: boolean;
  items: PaperItem[];
}
interface LicenseItem {
  guid: Guid;
  title: string;
  acknowledger: string;
  awardDate: string;
  verifiers: {
    name: string;
    did: string;
  }[];
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface LicenseDTO {
  isEnabled: boolean;
  items: LicenseItem[];
}
interface CertificationItem {
  guid: Guid;
  title: string;
  acknowledger: string;
  awardDate: string;
  verifiers: {
    name: string;
    did: string;
  }[];
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface CertificationDTO {
  isEnabled: boolean;
  items: CertificationItem[];
}

interface GameExpItem {
  guid: Guid;
  name: string;
  like: number;
  verifiers: {
    name: string;
    did: string;
  }[];
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface GameExpDTO {
  isEnabled: boolean;
  items: GameExpItem[];
}
interface GamerTagItem {
  guid: Guid;
  game: string;
  character: string;
  verifiers: {
    name: string;
    did: string;
  }[];
  order: string;
  isEmpty: boolean;
  logo?: string;
}
interface GamerTagDTO {
  isEnabled: boolean;
  items: GamerTagItem[];
}
interface ExperienceItem {
  guid: Guid;
  isEnabled: boolean;
  institution: string;
  program: string;
  start: string;
  end: string;
  still: boolean;
  verifiers: {
    name: string;
    did: string;
  }[];
  title: string;
  description: string;
  order: string;
  isEmpty: boolean;
  logo?: string;
}

interface Template {
  value: string;
  title: string;
  intro: string;
}
interface VerificationData {
  idKey: string;
  category: string;
  records: {
    field: string;
    value: string;
  }[];
}

interface VerificationRequest {
  feedbacks: string;
  msg: string;
  from_did: string;
  to_did: string;
  category: string;
  status: string;
  idKey: string;
  records: {
    field: string;
    value: string;
  }[];
  modified: { $date: string };
  credential: any;
  guid: Guid;
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
  verifiers: {
    name: string;
    did: string;
  }[];
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
  createdAt: number;
  updatedAt: number;
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
  name: {
    name: string;
    verifiers: {
      name: string;
      did: string;
    }[];
  };
  basicDTO: BasicDTO;
  experienceDTO: ExperienceDTO;
  educationDTO: EducationDTO;
  teamDTO: TeamDTO;
  thesisDTO: ThesisDTO;
  paperDTO: PaperDTO;
  licenseDTO: LicenseDTO;
  certificationDTO: CertificationDTO;
  gameExpDTO: GameExpDTO;
  gamerTagDTO: GamerTagDTO;
}

interface ISessionItem {
  hiveHost: string;
  userToken: string;
  accountType: AccountType;
  did: string;
  name: string;
  email?: string;
  isDIDPublished: boolean;
  isEssentialUser?: boolean;
  didPublishTime: number;
  mnemonics: string;
  passhash: string;
  tutorialStep: number;
  onBoardingCompleted: boolean;
  loginCred?: LoginCred;
  badges?: IBadges;
  avatar?: string;
  coverPhoto?: string;
  code?: string;
  status?: string;
  pageTemplate?: string;
  phone?: string;
  timestamp: number;
}

interface LoginCred {
  linkedin?: string;
  google?: string;
  twitter?: string;
  facebook?: string;
  github?: string;
  discord?: string;
  email?: string;
  phone?: string;
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

interface AccountBadgeItem {
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
  github: BadgeArchiveModel;
  discord: BadgeArchiveModel;
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

interface ProfileInfo {
  name: string;
}

interface ProfileContent {
  basic_profile: ProfileInfo;
}

interface ProfileResponse {
  _status: string;
  get_basic: GetBasic;
  get_education_profile: EducationDTO;
  get_experience_profile: ExperienceDTO;
}

interface BasicProfileResponse {
  _status: string;
  get_basic_profile: GetBasic;
}
interface TeamProfileResponse {
  _status: string;
  get_team_profile: TeamDTO;
}
interface ThesisProfileResponse {
  _status: string;
  get_thesis_profile: ThesisDTO;
}
interface PaperProfileResponse {
  _status: string;
  get_paper_profile: PaperDTO;
}
interface LicenseProfileResponse {
  _status: string;
  get_license_profile: LicenseDTO;
}
interface CertificationProfileResponse {
  _status: string;
  get_certification_profile: CertificationDTO;
}
interface GameExpProfileResponse {
  _status: string;
  get_game_exp_profile: GameExpDTO;
}
interface EducationProfileResponse {
  _status: string;
  get_education_profile: EducationDTO;
}

interface ExperienceProfileResponse {
  _status: string;
  get_experience_profile: ExperienceDTO;
}

interface GetBasic {
  items?: BasicDTO[] | null;
}

interface ITemporaryDID {
  mnemonic: string;
  confirmationId: string;
}

interface UserData {
  did: string;
  name: string;
  data: string;
}

interface SignInDIDData {
  name: string;
  did: string;
  hiveHost: string;
  userToken: string;
  isDIDPublished: boolean;
}

interface ProfileInfo {
  name: string;
}

interface ProfileContent {
  basic_profile: ProfileInfo;
}

interface ProfileResponse {
  _status: string;
  get_basic: GetBasic;
  get_education_profile: EducationDTO;
  get_experience_profile: ExperienceDTO;
}

interface BasicProfileResponse {
  _status: string;
  get_basic_profile: GetBasic;
}

interface EducationProfileResponse {
  _status: string;
  get_education_profile: EducationDTO;
}

interface ExperienceProfileResponse {
  _status: string;
  get_experience_profile: ExperienceDTO;
}

interface GetBasic {
  items?: BasicDTO[] | null;
}

interface ICreateUserResponse {
  meta: { code: number; message: string };
  data: {
    return_code: string;
    did: string;
  };
}

interface IVerifyCodeResponse {
  data: {
    return_code: string;
    name: string;
    email: string;
    did: string;
  };
}

interface IUpdateEmailResponse {
  data: {
    status: string;
  };
}

interface PublicProfileResponse {
  _status: string;
  get_public_fields: {
    items?:
      | {
          did: string;
          fields: string[];
        }[]
      | null;
  };
}

interface ThemeProps {
  template: string;
}

interface IGithubCommentItem {
  did?: string;
  githubIssueId: number;
  comment: string;
  createdAt: number;
}

interface SpacesResponse {
  _status: string;
  get_all_spaces: SpaceDTO;
}
interface SpaceDTO {
  items: Space[];
}
interface Space {
  name: string;
  description?: string;
  category: string;
  avatar?: string;
  coverPhoto?: string;
}
