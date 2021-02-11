import request, { BaseplateResp } from 'src/baseplate/request';
import { ProfileService } from 'src/services/profile.service';
import { ProfileContent } from '../ProfilePage/types';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
  return request(Api.sample, {
    headers: { 'content-type': 'text/plain' },
  });
}

export function requestVaultProfile(did: string): Promise<ProfileContent> {
  let profileContent: ProfileContent = {
    profile: { firstName: 'firstName', lastName: 'lastName' },
  };
  return Promise.resolve(profileContent);
}

export async function requestBasicProfile(did: string): Promise<any> {
  let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
  let getBasicprofileResponse: any;
  try {
    getBasicprofileResponse = await profileService.getUserBasicProfile(did);
    console.log(JSON.stringify(getBasicprofileResponse));
  } catch (error) {
    console.error(JSON.stringify(error));
  }
  return getBasicprofileResponse;
}

export async function requestEducationProfile(did: string): Promise<any> {
  let profileService: ProfileService = await ProfileService.getProfileServiceAppOnlyInstance();
  return profileService.getUserEducationProfile(did);
}
