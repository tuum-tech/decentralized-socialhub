/**
 * Type defined inside this container
 */
import { initialState } from './reducer';
import { Actions } from './constants';
import { Guid } from 'guid-typescript';

export type SubState = typeof initialState;

export type ActionType = typeof Actions;

export interface ProfileDTO {
  basicDTO: BasicDTO;
  experienceDTO: ExperienceDTO;
  educationDTO: EducationDTO;
}

export interface Entity {
  name: string;
  did?: string;
}

export interface ExperienceItem {
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

export interface BasicDTO {
  isEnabled: boolean;
  name: string;
  email: string;
  hiveHost: string;
  did: string;
  about: string;
  title: string;
  address: AddressDTO;
}

export interface AddressDTO {
  street_name: string;
  number: string;
  state: string;
  country: string;
  postal_code: string;
}

export interface ExperienceDTO {
  isEnabled: boolean;
  items: ExperienceItem[];
}

export interface Period {
  start: string;
  end?: string;
}

export interface EducationItem {
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

export interface EducationDTO {
  isEnabled: boolean;
  items: EducationItem[];
}
