import request, { BaseplateResp } from 'src/baseplate/request';
import { Api } from './constants';

import { ElastosClient } from "@elastos/elastos-js-sdk";

export function generateMnemonic() : Promise<BaseplateResp> {
    console.log("generating Mnemonic");    
    return ElastosClient.did.generateNew()
}

export function fetchSimpleApi() : Promise<BaseplateResp> {
    return request(Api.sample, {
        headers: { 'content-type': 'text/plain' }
    });
}