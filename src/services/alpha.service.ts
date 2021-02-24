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

    private static SessionKey: string = "invitecode"

    static addSession(accessCode: string) {
        window.sessionStorage.setItem(this.SessionKey, accessCode)
    }

    static async isSessionValid(): Promise<boolean> {
        let sessionItem = window.sessionStorage.getItem(this.SessionKey)
        if (!sessionItem) return false

        return await this.isCodeValid(sessionItem)
    }

    static async useCode(accesscode: string, did: string): Promise<boolean> {
        let client = await HiveService.getAppHiveClient();

        let scriptResponse = await client.Scripting.RunScript({
            "name": "user_access_code",
            "context": {
                "target_did": process.env.REACT_APP_APPLICATION_DID,
                "target_app_did": process.env.REACT_APP_APPLICATION_ID
            },
            "params": {
                "accesscode": accesscode,
                "did": did
            }
        })
        return scriptResponse.isSuccess
    }

    static async requestAccess(email: string): Promise<boolean> {

        try {

            let fields = `EMAIL=${encodeURIComponent(email)}&b_8d74b221b8912cf1478a69f37_1eb3890eaf=`
            console.log(fields)
            await fetch(`${process.env.REACT_APP_MAILCHIMP_URL}`, {
              method: 'POST',
              mode: "no-cors",
              headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
              },
              body: fields
            })
      
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
            
        } catch (error) {
            return false
        }

       
    }


}