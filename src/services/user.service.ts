import { combineReducers } from "redux";
import { AssistService } from "./assist.service";
import { DidService } from "./did.service";
import { CredentialType, DidcredsService } from "./didcreds.service";
import { HiveService } from './hive.service';


const CryptoJS = require("crypto-js");


export enum AccountType{
    DID = "DID",
    Linkedin = "Linkedin",
    Facebook = "Facebook",
    Google = "Google",
    Twitter = "Twitter"
}

export interface ISessionItem {
    hiveHost: string,
    userToken: string,
    accountType: AccountType,
    did: string,
    userName: string,
    isDIDPublished: boolean
}

export interface ITemporaryDID{
    mnemonic: string,
    confirmationId: string
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

    private static getOtherUsers(appName: string): string[]{
        let appKey = appName + "_"
        let response: string[] = []
        for (var i = 0, len = window.localStorage.length; i < len; ++i) {

            let key = window.localStorage.key(i);
            if (key && key.startsWith(appKey)) {
                response.push(key.replace(appKey, ""))
            }
        }
        return response
    }

   
    public static GetUserSession(): ISessionItem {
        let item = window.sessionStorage.getItem("session_instance")

        if (!item) {
            throw Error("Not logged in")
        }

        return JSON.parse(item);
    }


    public static SignInWithDID(data: SignInDIDData, storePassword: string) {
        let sessionItem: ISessionItem = {
            did: data.did,
            accountType: AccountType.DID,
            isDIDPublished: data.isDIDPublished,
            userName: data.name,
            hiveHost: data.hiveHost,
            userToken: data.userToken
        }

        this.lockUser(this.key(data.did), sessionItem, storePassword)
        
        SessionService.saveSessionItem(sessionItem)
    }

    public static async SignInWithFacebook(id: string, name: string, token: string, credential: string, password: string = ''){
        await this.SignIn3rdParty(id, name, token, AccountType.Facebook, credential, password)
    }

    public static async SignInWithLinkedin(id: string, name: string, token: string, credential: string, password: string = ''){
        await this.SignIn3rdParty(id, name, token, AccountType.Linkedin, credential, password)
    }

    public static async SignInWithGoogle(id: string, name: string, token: string, credential: string, password: string = ''){
        await this.SignIn3rdParty(id, name, token, AccountType.Google, credential, password)
    }

    public static async SignInWithTwitter(id: string, name: string, token: string, credential: string, password: string = ''){
        await this.SignIn3rdParty(id, name, token, AccountType.Twitter, credential, password)
    }

    private static async SignIn3rdParty(id: string, name: string, token: string, service: AccountType, credential: string, password: string){
        console.log("Sign in with", service.toString())
        let otherUsers = UserService.getOtherUsers(service.toString())
        let key = `${service.toString()}_${id}`
        let storePassword = (password && password !== '') ? password : key
        let sessionItem: ISessionItem
        if (!otherUsers.includes(id)){
            let did = await this.generateTemporaryDID(service, credential)
            sessionItem = {
                did: did,
                accountType: service,
                isDIDPublished: false,
                userName: name,
                hiveHost: "http://localhost:5000",
                userToken: token
            }
            // run tuumtech vault script to record user
            const appHiveClient = await HiveService.getAppHiveClient();
            await appHiveClient.Scripting.RunScript({
                "name": "add_userrecord_to_end",
                "params": {
                    "name": sessionItem.userName,
                    "vaulturl": sessionItem.hiveHost,
                }
            });

        }
        else {
            sessionItem =  this.unlockUser(key, key)
            sessionItem.userToken = token
            sessionItem.userName = name
        }
        console.log(sessionItem)
        this.lockUser(key, sessionItem, storePassword)
        SessionService.saveSessionItem(sessionItem)
    }

    private static getCredentialType(service: AccountType) : CredentialType{
        if (service === AccountType.Facebook) return CredentialType.Facebook;
        if (service === AccountType.Twitter) return CredentialType.Twitter;
        if (service === AccountType.Google) return CredentialType.Google;
        if (service === AccountType.Linkedin) return CredentialType.Linkedin;
        throw Error("Invalid account type")
    }

    private static async  generateTemporaryDID(service: AccountType, credential: string) : Promise<string>{
        console.log("Generating temporary DID")
        let newDID = await DidService.generateNew()
        let temporaryDocument = await DidService.temporaryDidDocument(newDID)
        
        let vc = DidcredsService.generateVerifiableCredential(newDID.did, this.getCredentialType(service), credential)

        DidService.addVerfiableCredentialToDIDDocument(temporaryDocument,vc)

        DidService.sealDIDDocument(newDID, temporaryDocument)

        let requestPub = await DidService.generatePublishRequest(temporaryDocument)

        let response = await AssistService.publishDocument(newDID.did, requestPub)

        window.localStorage.setItem(`temporary_${newDID.did.replace("did:elastos:", "")}`, JSON.stringify({
            mnemonic: newDID.mnemonic
        }))

        window.localStorage.setItem(`publish_${response.confirmationId}`, JSON.stringify({
            confirmationId: response.confirmationId,
            status: response.requestStatus
        }))


        return newDID.did
    }

    static async getLoggedUser(): Promise<ISessionItem>{
        return SessionService.getSession()
    }

    private static lockUser(key: string, instance: ISessionItem, storePassword: string){

        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(instance), storePassword).toString();
        console.log("encripted value", encrypted)
        let localUserData: UserData = {
            name: instance.userName,
            did: instance.did,
            data: encrypted
        }
        let json = JSON.stringify(localUserData, null, "")
        window.localStorage.setItem(key, json)
    }

    private static unlockUser(key: string, storePassword: string): ISessionItem{
        console.log("Unlocking user", key)
        let item = window.localStorage.getItem(key)
        
        if (!item) throw new Error("User not found")
        
        try {
            let userData: UserData = JSON.parse(item)
            console.log("user data", userData)
            let decrypted = CryptoJS.AES.decrypt(userData.data, storePassword);
            console.log("decrypted", decrypted)
            let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
            console.log("instance", instance)
            if (!instance && !instance.userToken) throw new Error("Incorrect password")
            return instance
        } catch (error) {
            console.error(error)
            throw error
        }
    }

    
    public static Login(did: string, storePassword: string) {
        let instance = this.unlockUser(this.key(did), storePassword)
        SessionService.saveSessionItem(instance)
    }

   

}


//To be 
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