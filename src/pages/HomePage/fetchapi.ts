import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}


export function requestLinkedinLogin(): Promise<BaseplateResp> {
    return request(`${process.env.REACT_APP_DIDCREDS_URL}/v1/auth/linkedin_request`, {
        headers: {
            'content-type': 'text/plain',
            'Authorization': `${process.env.REACT_APP_DIDCREDS_KEY}`,
            'Accept': 'application/json'
        }
    });
}