/**
 * Type defined inside this container
*/
import { initialState } from './reducer';
import { mapDispatchToProps, mapStateToProps } from './index';
import { Actions } from './constants';

export type SubState = typeof initialState;
export type InferMappedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export type ActionType = typeof Actions;



export interface ProfileInfo {
    localizedFirstName: string,
    localizedLastName: string
}

export interface ProfileContent {
    profile: ProfileInfo
}

export interface ProfileResponse {
    data: ProfileContent
}