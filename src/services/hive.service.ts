import { HiveClient, OptionsBuilder } from "@elastos/elastos-hive-js-sdk"
import { ISessionItem, SessionService } from "./session.service"
export class HiveService{

    
    async getSessionInstance(did: string) : Promise<HiveClient>{

        let item = SessionService.get(did)

        if (!item){
            throw Error("Not logged in")
        }

        return await HiveClient.createInstance(item.userToken, item.hiveHost)
    }

     

}