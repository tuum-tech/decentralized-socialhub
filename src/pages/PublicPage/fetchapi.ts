import { IRunScriptResponse } from '@elastos/elastos-hive-js-sdk/dist/Services/Scripting.Service';
import request, { BaseplateResp } from 'src/baseplate/request';
import { ProfileService } from 'src/services/profile.service';
import { ProfileContent, ProfileResponse } from '../ProfilePage/types';
import { Api } from './constants';
import { EducationItem, ProfileDTO } from './types';

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' }
  });
}

// export function requestVaultProfile(did: string): Promise<ProfileContent> {
//   let profileContent: ProfileContent = {
//     profile: { firstName: 'firstName', lastName: 'lastName' },
//   };
//   return Promise.resolve(profileContent);
// }

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
    console.error(JSON.stringify(error));
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
