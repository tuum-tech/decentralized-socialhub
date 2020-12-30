import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}

export function requestLinkedinToken(code: string, state: string): Promise<BaseplateResp> {

    return request(`${process.env.REACT_APP_DIDCREDS_URL}/v1/auth/linkedin_callback?code=${code}&state=${state}`, {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Authorization': `${process.env.REACT_APP_DIDCREDS_KEY}`,
            'Accept': 'application/json'
        }
    });
}

