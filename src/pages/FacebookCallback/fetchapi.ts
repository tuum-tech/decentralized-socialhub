import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';

export function fetchSimpleApi() : Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}

export function requestFacebookToken(code: string, state: string): Promise<BaseplateResp> {

    return request(`${process.env.REACT_APP_PROFILE_API_SERVICE_URL}/v1/auth/facebook_callback?code=${code}&state=${state}`, {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Authorization': `${process.env.REACT_APP_PROFILE_API_SERVICE_KEY}`,
            'Accept': 'application/json'
        }
    });
}