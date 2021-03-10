/**
 * Type defined inside this container
 */
import { initialState } from './reducer'
import { mapDispatchToProps, mapStateToProps } from './index'
import { Actions } from './constants'

export type SubState = typeof initialState
export type InferMappedProps = ReturnType<typeof mapStateToProps> &
  ReturnType<typeof mapDispatchToProps>

export type ActionType = typeof Actions

export interface ProfileDTO {
  basicDTO: BasicDTO
  experienceDTO: ExperienceDTO
  educationDTO: EducationDTO
}

export interface Entity {
  name: string
  did?: string
}

export interface ExperienceItem {
  _id: string
  isEnabled: boolean
  institution: string
  program: string
  start: string
  end: string
  title: string
  description: string
  order: string
  isEmpty: boolean
}

export interface BasicDTO {
  isEnabled: boolean
  name: string
  email: string
  hiveHost: string
  did: string
  about: string
  title: string
  address: AddressDTO
}

export interface AddressDTO {
  street_name: string
  number: string
  state: string
  country: string
  postal_code: string
}

export interface ExperienceDTO {
  isEnabled: boolean
  items: ExperienceItem[]
}

export interface Period {
  start: string
  end?: string
}

export interface EducationItem {
  isEmpty: boolean
  _id: string
  institution: string
  program: string
  start: string
  end: string
  title: string
  description: string
  order: string
}

export interface EducationDTO {
  isEnabled: boolean
  items: EducationItem[]
}
