/**
 * Type defined inside this container
*/
import { initialState } from './reducer';
import { mapDispatchToProps, mapStateToProps } from './index';
import { Actions } from './constants';
import { BasicDTO, EducationDTO, EducationItem, ExperienceDTO } from '../PublicPage/types';

export type SubState = typeof initialState;
export type InferMappedProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>

export type ActionType = typeof Actions;



export interface ProfileInfo {
    lastName?: string,
    firstName?: string,
}

export interface ProfileContent {
    basic_profile: ProfileInfo
}



//{"isSuccess":true,"response":{"_status":"OK","get_basic":{"items":[{"_id":{"$oid":"60328ede2416bfb5e84f78c7"},"birthDate":"1984-04-12","created":{"$date":1613926110275},"did":"did:elastos:iVy37oQuQ77L6SfXyNiBmdW2TSoyJQmBU1","modified":{"$date":1613926110275},"name":"Diego","nationality":"brazilian","surname":"Chagastelles"}]},"get_education_profile":{"items":[{"_id":{"$oid":"60328ede2416bfb5e84f78da"},"created":{"$date":1613926110443},"description":"everything I did.","end":"2006-11-20","field":"IT","institution":"UFRGS","modified":{"$date":1613926110443},"program":"Computer Engineering","start":"2001-02-20"},{"_id":{"$oid":"60328ede2416bfb5e84f78e0"},"created":{"$date":1613926110481},"description":"everything I did. Great program.","end":"2011-11-20","field":"distributed systems","institution":"MIT","modified":{"$date":1613926110481},"program":"masters","start":"2007-02-20"}]}}}


export interface ProfileResponse {
    _status: string;
    get_basic: GetBasic;
    get_education_profile: EducationDTO;
    get_experience_profile: ExperienceDTO;
}

export interface GetBasic {
    items?: (BasicDTO)[] | null;
}


