import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import request, { BaseplateResp } from 'src/baseplate/request';
import { ProfileService } from 'src/services/profile.service';
import { ProfileResponse } from '../ProfilePage/types';
import { Api } from './constants';
import { ProfileDTO } from './types';
import { alertError } from 'src/utils/notify';

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' }
  });
}

export async function requestFullProfile(did: string): Promise<ProfileDTO> {
  let getFullProfileResponse: IRunScriptResponse<ProfileResponse> = {} as IRunScriptResponse<
    ProfileResponse
  >;
  getFullProfileResponse = await ProfileService.getFullProfile(did);

  return mapProfileResponseToProfileDTO(
    getFullProfileResponse.response as ProfileResponse
  );
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
