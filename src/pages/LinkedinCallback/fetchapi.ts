import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}

export function requestLinkedinToken(code: string, state: string): Promise<BaseplateResp> {

    return request(`http://localhost:8081/v1/auth/linkedin_callback?code=${code}&state=${state}`, {
        method: 'GET',
        headers: {
            'content-type': 'text/plain',
            'Authorization': 'didcreds-validator-secret-key',
            'Accept': 'application/json'
        }
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