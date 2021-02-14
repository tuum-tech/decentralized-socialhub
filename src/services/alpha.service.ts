import { HiveService } from "./hive.service";


export class AlphaService {
    static async isCodeValid(accesscode: string): Promise<boolean> {
        let client = await HiveService.getAppHiveClient();

        let scriptResponse = await client.Scripting.RunScript<any>({
            "name": "get_requestcode_status",
            "context": {
                "target_did": process.env.REACT_APP_APPLICATION_DID,
                "target_app_did": process.env.REACT_APP_APPLICATION_ID
            },
            "params": {
                "accesscode": accesscode
            }
        })

        if (!scriptResponse.isSuccess ||
            !scriptResponse.response.requeststatus ||
            scriptResponse.response.requeststatus.items.length == 0) {
            return false
        }

        return !scriptResponse.response.requeststatus.items[0].isUsed

    }

    static async useCode(accesscode: string): Promise<boolean> {
        let client = await HiveService.getAppHiveClient();

        let scriptResponse = await client.Scripting.RunScript({
            "name": "user_access_code",
            "context": {
                "target_did": process.env.REACT_APP_APPLICATION_DID,
                "target_app_did": process.env.REACT_APP_APPLICATION_ID
            },
            "params": {
                "accesscode": accesscode
            }
        })

       

          return scriptResponse.isSuccess
    }

    static async requestAccess(email: string): Promise<boolean> {
        let client = await HiveService.getAppHiveClient();

        let scriptResponse = await client.Scripting.RunScript({
            "name": "email_request_access",
            "context": {
                "target_did": process.env.REACT_APP_APPLICATION_DID,
                "target_app_did": process.env.REACT_APP_APPLICATION_ID
            },
            "params": {
                "email": email
            }
        })

        return scriptResponse.isSuccess
    }


}