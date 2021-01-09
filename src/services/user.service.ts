

const CryptoJS = require("crypto-js");

export interface ISessionItem{
    hiveHost: string,
    userToken: string
}

interface Users {
    keys: Array<string>
}

export class UserService {
    private static key(did: string): string {
        return `user_${did.replace("did:elastos:", "")}`
    }

    public static SignIn(did: string, hiveHost: string, userToken: string, storePassword: string){

        let item: ISessionItem = {
            hiveHost: hiveHost,
            userToken: userToken
        }

        let instance = JSON.stringify(item, null, "")
        let encrypted = CryptoJS.AES.encrypt(instance, storePassword).toString();
        
        window.sessionStorage.clear()
        window.localStorage.setItem(this.key(did), encrypted )
        window.sessionStorage.setItem("session_instance", instance)
    }


    public static Login(did: string, storePassword: string){

        let item = window.localStorage.getItem(this.key(did))

        if (!item) throw new Error("User not found")

        let decrypted = CryptoJS.AES.decrypt(item, storePassword).toString();

        let instance = JSON.parse(decrypted)

        if (!instance) throw new Error("Incorrect password")

        window.sessionStorage.clear()
        window.sessionStorage.setItem("session_instance", instance)
        
    }

    public static Logout() {
        window.sessionStorage.clear()
    }

}