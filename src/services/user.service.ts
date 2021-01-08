import { ISessionItems } from "@elastos/elastos-hive-js-sdk/dist/Interfaces/ISessionItems";
import { ISessionItem } from "./session.service";

const CryptoJS = require("crypto-js");

interface Users {
    keys: Array<string>
}

export class UserService {
    private static key(did: string): string {
        return `user_${did.replace("did:elastos:", "")}`
    }

    public static async SignIn(did: string, hiveHost: string, userToken: string, storePassword: string){

        let item: ISessionItem = {
            hiveHost: hiveHost,
            userToken: userToken
        }
        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(item, null, ""), storePassword).toString();
        window.localStorage.setItem(this.key(did), encrypted )
    }

}