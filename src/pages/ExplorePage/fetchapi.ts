import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import request, { BaseplateResp } from 'src/baseplate/request';
import { ProfileService } from 'src/services/profile.service';
import { ProfileResponse } from '../ProfilePage/types';
import { ProfileDTO } from '../PublicPage/types';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' }
  });
}

export async function requestFullProfile(did: string): Promise<ProfileDTO> {
  let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
  let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
    ProfileResponse
  >;
  try {
    getFullProfileResponse = await profileService.getFullProfile(did);

    return mapProfileResponseToProfileDTO(
      getFullProfileResponse.response as ProfileResponse
    );
  } catch (error) {
    // console.error(JSON.stringify(error));
    // alertError(null, 'Failed requestFullProfile');
  }
  return mapProfileResponseToProfileDTO({} as ProfileResponse);
}

const mapProfileResponseToProfileDTO = (
  fullProfileResponse: ProfileResponse
): ProfileDTO => {
  let basicProfile = fullProfileResponse.get_basic.items![0];
  let educationProfile = fullProfileResponse.get_education_profile;
  let experienceProfile = fullProfileResponse.get_experience_profile;

  return {
    basicDTO: basicProfile,
    educationDTO: educationProfile,
    experienceDTO: experienceProfile
  };
};
