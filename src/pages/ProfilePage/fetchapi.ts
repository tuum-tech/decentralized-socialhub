import request, { BaseplateResp } from 'src/baseplate/request';
import { ProfileService } from 'src/services/profile.service';
import { EducationDTO, EducationItem, ProfileDTO } from '../PublicPage/types';
import { Api } from './constants';
import { ProfileResponse } from './types';

export function fetchSimpleApi(): Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}



export function requestLinkedinProfile(request_token: string): Promise<BaseplateResp> {

    return request(`http://localhost:8081/v1/auth/linkedin_profile?request_token=${request_token}`, {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Authorization': 'didcreds-validator-secret-key',
            'Accept': 'application/json'
        }
    });
}

export async function requestFullProfile(did: string): Promise<ProfileDTO> {
    let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
    let getFullProfileResponse: any;
    try {
        getFullProfileResponse = await profileService.getFullProfile(did);
        console.log(JSON.stringify(getFullProfileResponse));
    } catch (error) {
        console.error(JSON.stringify(error));
    }
    return mapProfileResponseToProfileDTO(getFullProfileResponse);
}

const mapProfileResponseToProfileDTO = (fullProfileResponse: ProfileResponse): ProfileDTO => {

    let basicProfile = fullProfileResponse.get_basic.items![0];
    let educationProfile = fullProfileResponse.get_education_profile;
    let experienceProfile = fullProfileResponse.get_experience_profile;

    return {
        basicDTO: basicProfile,
        educationDTO: educationProfile,
        experienceDTO: experienceProfile
    };
}