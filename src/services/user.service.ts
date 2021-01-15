
const CryptoJS = require("crypto-js");


export enum AccountType{
    DID = "DID",
    AnotherService = "AnotherService"
}

export interface ISessionItem {
    hiveHost: string,
    userToken: string,
    accountType: AccountType,
    did: string,
    userName: string,
    isAccountPublished: boolean
}

export interface UserData{
    did: string,
    name: string,
    data: string
}

export interface SignInDIDData{
    name: string,
    did: string, 
    hiveHost: string,
    userToken: string,
    isDIDPublished: boolean
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


    public static SignInWithDID(data: SignInDIDData, storePassword: string) {
        let sessionItem: ISessionItem = {
            did: data.did,
            accountType: AccountType.DID,
            isAccountPublished: data.isDIDPublished,
            userName: data.name,
            hiveHost: data.hiveHost,
            userToken: data.userToken
        }

        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(sessionItem, null, ""), storePassword);

        let localUserData: UserData = {
            name: data.name,
            did: data.did,
            data: encrypted
        }

        window.localStorage.setItem(this.key(data.did), JSON.stringify(localUserData, null, ""))
        
        SessionService.saveSessionItem(sessionItem)
    }

    static async getLoggedUser(): Promise<ISessionItem>{
        return SessionService.getSession()
    }

    
    public static Login(did: string, storePassword: string) {

        let item = window.localStorage.getItem(this.key(did))
        
        if (!item) throw new Error("User not found")
        
        try {
            let userData: UserData = JSON.parse(item)
            let decrypted = CryptoJS.AES.decrypt(userData.data, storePassword);
            let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
            if (!instance && !instance.userToken) throw new Error("Incorrect password")
            SessionService.saveSessionItem(instance)
        } catch (error) {
            console.log(error)
            throw new Error("Incorrect password")
        }
    }

   

}



class SessionService{

   static async getSession() : Promise<ISessionItem>{
        let item = window.sessionStorage.getItem("session_instance")

        if (!item){
            throw Error("Not logged in")
        } 

        let instance = JSON.parse(item)

        return instance
    }

    

    static async saveSessionItem(item: ISessionItem){
        window.sessionStorage.clear()
        window.sessionStorage.setItem("session_instance", JSON.stringify(item, null, ""))
    }

    static Logout() {
        window.sessionStorage.clear()
    }

}