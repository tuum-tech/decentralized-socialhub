import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
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

//

export async function requestFullProfile(did: string): Promise<ProfileDTO> {
  let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
  let getFullProfileResponse: any;
  try {
    getFullProfileResponse = await profileService.getFullProfile(did);
  } catch (error) {
    // console.error(JSON.stringify(error));
  }
  return mapProfileResponseToProfileDTO(getFullProfileResponse);
}

const mapProfileResponseToProfileDTO = (
  fullProfileResponse: IRunScriptResponse<ProfileResponse>
): ProfileDTO => {
  let basicProfile = fullProfileResponse.response!.get_basic.items![0];
  let educationProfile = fullProfileResponse.response!.get_education_profile;
  let experienceProfile = fullProfileResponse.response!.get_experience_profile;

  return {
    basicDTO: basicProfile,
    educationDTO: educationProfile,
    experienceDTO: experienceProfile
  };
};
