import request, { BaseplateResp } from 'src/baseplate/request';
import { ProfileContent, ProfileInfo } from '../ProfilePage/types';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}

export function requestVaultProfile(did: string): Promise<ProfileContent> {
    let profileContent: ProfileContent =
    {
        profile: { firstName: "firstName", lastName: "lastName" }
    };
    return Promise.resolve(profileContent);
}