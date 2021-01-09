import { HiveClient, OptionsBuilder } from "@elastos/elastos-hive-js-sdk"
import { IOptions } from "@elastos/elastos-hive-js-sdk/dist/Interfaces/IOptions";
import { DidService } from "./did.service"

const jwt_decode = require('jwt-decode');

export interface IHiveChallenge{
    issuer: string,
    nonce: string
}

export class HiveService{

    
    static async getSessionInstance(did: string) : Promise<HiveClient>{

        let item = window.sessionStorage.getItem("session_instance")

        if (!item){
            throw Error("Not logged in")
        } 

        let instance = JSON.parse(item)

        return await HiveClient.createInstance(instance.userToken, instance.hiveHost)
    }

    private static async getHiveOptions(hiveHost: string, ): Promise<IOptions>{
        //TODO: change to appInstance
        let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let appId = `${process.env.REACT_APP_APPLICATION_ID}`

        let builder = new OptionsBuilder()
        await builder.setApp(appId, mnemonic)
        builder.setHiveHost(hiveHost)
        return builder.build()
    }

    

    static async getHiveChallenge(hiveHost: string) : Promise<IHiveChallenge>{
        let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let options = await this.getHiveOptions(hiveHost)
        let appDid = await DidService.getDid(mnemonic)
        let appDocument = await DidService.getDocument(appDid)
        let response = await HiveClient.getApplicationChallenge(options, appDocument)

        let jwt = jwt_decode(response.challenge);

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