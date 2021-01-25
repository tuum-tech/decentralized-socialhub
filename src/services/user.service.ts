import { combineReducers } from "redux";
import { AssistService } from "./assist.service";
import { DidService } from "./did.service";


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

    public static async SignInWithFacebook(id: string, name: string, token: string){
        await this.SignIn3rdParty(id, name, token, AccountType.Facebook)
    }

    public static async SignInWithLinkedin(id: string, name: string, token: string){
        await this.SignIn3rdParty(id, name, token, AccountType.Linkedin)
    }

    public static async SignInWithGoogle(id: string, name: string, token: string){
        await this.SignIn3rdParty(id, name, token, AccountType.Google)
    }

    public static async SignInWithTwitter(id: string, name: string, token: string){
        await this.SignIn3rdParty(id, name, token, AccountType.Twitter)
    }

    private static async SignIn3rdParty(id: string, name: string, token: string, service: AccountType){
        console.log("Sign in with", service.toString())
        let otherUsers = UserService.getOtherUsers(service.toString())
        let key = `${service.toString()}_${id}`
        let storePassword = key
        let sessionItem: ISessionItem
        if (!otherUsers.includes(id)){
            let did = await this.generateTemporaryDID() 
            sessionItem = {
                did: did,
                accountType: service,
                isDIDPublished: false,
                userName: name,
                hiveHost: "http://localhost:5000",
                userToken: token
            }
        }
        else {
            sessionItem =  this.unlockUser(key, "")
            sessionItem.userToken = token
            sessionItem.userName = name
        }

        this.lockUser(key, sessionItem, storePassword)
        SessionService.saveSessionItem(sessionItem)
    }

    private static async  generateTemporaryDID() : Promise<string>{
        console.log("Generating temporary DID")
        let newDID = await DidService.generateNew()
        let temporaryDocument = await DidService.temporaryDidDocument(newDID)
        let requestPub = await DidService.generatePublishRequest(temporaryDocument)

        let response = await AssistService.publishDocument(newDID.did, requestPub)
        console.log("Publish document confirmation id", response.confirmationId)

        window.localStorage.setItem(`temporary_${newDID.did.replace("did:elastos:", "")}`, JSON.stringify({
            mnemonic: newDID.mnemonic
        }))

        window.localStorage.setItem(`publish_${response.confirmationId}`, JSON.stringify({
            did: newDID.did,
            status: response.requestStatus
        }))


        return newDID.did
    }

    static async getLoggedUser(): Promise<ISessionItem>{
        return SessionService.getSession()
    }

    private static lockUser(key: string, instance: ISessionItem, storePassword: string){

        let encrypted = CryptoJS.AES.encrypt(JSON.stringify(instance, null, ""), storePassword).toString();
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
            let decrypted = CryptoJS.AES.decrypt(userData.data, storePassword);
            let instance = JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
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