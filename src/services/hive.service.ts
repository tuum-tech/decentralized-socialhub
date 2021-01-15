import { HiveClient, OptionsBuilder, IOptions } from "@elastos/elastos-hive-js-sdk"

import { DidService } from "./did.service"

import jwt_decode from 'jwt-decode';
import { UserService } from "./user.service";


export interface IHiveChallenge{
    issuer: string,
    nonce: string
}

export class HiveService{

    
    static async getSessionInstance() : Promise<HiveClient>{

        let instance = await UserService.getLoggedUser()

        return await HiveClient.createInstance(instance.userToken, instance.hiveHost)
    }

    private static async getHiveOptions(hiveHost: string ): Promise<IOptions>{
        //TODO: change to appInstance
        let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let appId = `${process.env.REACT_APP_APPLICATION_ID}`
        let appDid = await DidService.getDid(mnemonic)
        let builder = new OptionsBuilder()
        await builder.setAppInstance(appId, appDid)
        builder.setHiveHost(hiveHost)
        return builder.build()
    }

    

    static async getHiveChallenge(hiveHost: string) : Promise<IHiveChallenge>{
        let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let options = await this.getHiveOptions(hiveHost)
        let appDid = await DidService.getDid(mnemonic)
        let appDocument = await DidService.getDocument(appDid)
        let response = await HiveClient.getApplicationChallenge(options, appDocument)

        let jwt = jwt_decode<any>(response.challenge);

        return {
            issuer: jwt.iss,
            nonce: jwt.nonce
        }
    }

    static async getUserHiveToken(hiveHost: string, presentation: any) : Promise<string>{
        let options = await this.getHiveOptions(hiveHost)
        return await HiveClient.getAuthenticationToken(options, presentation)
    }
    

}