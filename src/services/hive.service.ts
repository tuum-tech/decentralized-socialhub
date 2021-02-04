import { HiveClient, OptionsBuilder, IOptions } from "@elastos/elastos-hive-js-sdk"

import { DidService } from "./did.service"

import jwt_decode from 'jwt-decode';

export interface IHiveChallenge {
    issuer: string,
    nonce: string
}

export class HiveService {


    static async getSessionInstance(): Promise<HiveClient> {

        let item = window.sessionStorage.getItem("session_instance")

        if (!item) {
            throw Error("Not logged in")
        }


        let instance = JSON.parse(item)

        let hiveClient = await HiveClient.createInstance(instance.userToken, instance.hiveHost)
        await hiveClient.Payment.CreateFreeVault();
        return hiveClient;
    }

    static async getToken(address: string): Promise<string> {
        let token = window.sessionStorage.getItem("app_token");

        if (!token) {
            debugger;
            let mnemonic = `${process.env.REACT_APP_TUUM_TECH_MNEMONICS}`
            let challenge = await HiveService.getHiveChallenge(address)
            let presentation = await DidService.generateVerifiablePresentationFromUserMnemonics(mnemonic, "", challenge.issuer, challenge.nonce)
            let token = await HiveService.getUserHiveToken(address, presentation)
            window.sessionStorage.setItem("app_token", token);
        }
        return token || "";
    }

    static async getAppHiveClient(): Promise<HiveClient> {

        let host = `${process.env.REACT_APP_TUUM_TECH_HIVE}`
        let appToken = await HiveService.getToken(host);
        let hiveClient = await HiveClient.createInstance(appToken, host)
        await hiveClient.Payment.CreateFreeVault();
        return hiveClient;
    }



    private static async getHiveOptions(hiveHost: string,): Promise<IOptions> {
        //TODO: change to appInstance
        let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let appId = `${process.env.REACT_APP_APPLICATION_ID}`
        let appDid = await DidService.getDid(mnemonic)
        let builder = new OptionsBuilder()
        await builder.setAppInstance(appId, appDid)
        builder.setHiveHost(hiveHost)
        return builder.build()
    }



    static async getHiveChallenge(hiveHost: string): Promise<IHiveChallenge> {
        let mnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let options = await this.getHiveOptions(hiveHost)
        let appDid = await DidService.getDid(mnemonic)
        let appDocument = await DidService.getDocument(appDid)
        let response = await HiveClient.getApplicationChallenge(options, appDocument)

        let jwt = jwt_decode<any>(response.challenge);

        return {
            issuer: jwt.iss,
            nonce: jwt.nonce
        }
    }

    static async getUserHiveToken(hiveHost: string, presentation: any): Promise<string> {
        let options = await this.getHiveOptions(hiveHost)
        return await HiveClient.getAuthenticationToken(options, presentation)
    }


}