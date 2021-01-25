

const CryptoJS = require("crypto-js");

export interface ISessionItem {
    hiveHost: string,
    userToken: string,
    did: string
}

interface Users {
    keys: Array<string>
}

export class UserService {
    private static key(did: string): string {
        return `user_${did.replace("did:elastos:", "")}`
    }

    public static getSignedUsers(): string[] {
        let response: string[] = []

        for (var i = 0, len = window.localStorage.length; i < len; ++i) {
            let key = window.localStorage.key(i);
            if (key && key.startsWith("user_")) {
                response.push(key.replace("user_", "did:elastos:"))
            }
        }
        return response
    }


    public static SignIn(did: string, hiveHost: string, userToken: string, storePassword: string) {

        let item: ISessionItem = {
            hiveHost: hiveHost,
            userToken: userToken,
            did: did
        }

        let instance = JSON.stringify(item, null, "")
        let encrypted = CryptoJS.AES.encrypt(instance, storePassword);
        window.sessionStorage.clear()
        window.localStorage.setItem(this.key(did), encrypted)
        window.sessionStorage.setItem("session_instance", instance)
    }

    public static GetUserSession(): ISessionItem {
        let item = window.sessionStorage.getItem("session_instance")

        if (!item) {
            throw Error("Not logged in")
        }

        return JSON.parse(item);
    }


    public static Login(did: string, storePassword: string) {

        let item = window.localStorage.getItem(this.key(did))

        if (!item) throw new Error("User not found")

        let decrypted = CryptoJS.AES.decrypt(item, storePassword);

        try {
            let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
            if (!instance && !instance.userToken) throw new Error("Incorrect password")
            window.sessionStorage.clear()
            window.sessionStorage.setItem("session_instance", instance)
        } catch (error) {
            console.log(error)
            throw new Error("Incorrect password")
        }




    }

    public static Logout() {
        window.sessionStorage.clear()
    }

}