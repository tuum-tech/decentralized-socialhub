import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';

export function fetchSimpleApi(): Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}

export function requestLinkedinLogin(): Promise<BaseplateResp> {
    return request("http://localhost:8081/v1/auth/linkedin_request", {
        headers: {
            'content-type': 'text/plain',
            'Authorization': 'didcreds-validator-secret-key',
            'Accept': 'application/json'
        }
    });
}