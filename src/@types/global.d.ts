interface ExperienceItem {
  guid: Guid;
  isEnabled: boolean;
  institution: string;
  program: string;
  start: string;
  end: string;
  title: string;
  description: string;
  order: string;
  isEmpty: boolean;
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
  stillWorking: boolean;
  title: string;
  description: string;
  order: string;
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
  onBoardingCompleted: boolean;
  avatar?: string;
  tutorialStep: number;
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
