/**
 * Type defined inside this container
 */
import { Actions } from './constants';

export type ActionType = typeof Actions;

export interface ProfileInfo {
  name: string;
}

export interface ProfileContent {
  basic_profile: ProfileInfo;
}

export interface ProfileResponse {
  _status: string;
  get_basic: GetBasic;
  get_education_profile: EducationDTO;
  get_experience_profile: ExperienceDTO;
}

export interface BasicProfileResponse {
  _status: string;
  get_basic_profile: GetBasic;
}

export interface EducationProfileResponse {
  _status: string;
  get_education_profile: EducationDTO;
}

export interface ExperienceProfileResponse {
  _status: string;
  get_experience_profile: ExperienceDTO;
}

export interface GetBasic {
  items?: BasicDTO[] | null;
}
