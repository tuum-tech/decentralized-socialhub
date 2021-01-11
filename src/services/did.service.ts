import { ElastosClient } from "@elastosfoundation/elastos-js-sdk"

export class DidService{
    
    static async getDid(mnemonic: string, password: string = ""): Promise<any>{
       return  await ElastosClient.did.loadFromMnemonic(mnemonic, password)
    }

    static async getDocument(did: any): Promise<any>{
        //TEMPORARY: The real method will get the document fom blockchain or cache
        let document = ElastosClient.didDocuments.newDIDDocument(did)
        ElastosClient.didDocuments.sealDocument(did, document)
        return document
    }

    static async generateVerifiablePresentationFromUserMnemonics(userMnemonic: string, password: string, issuer: string, nonce: string): Promise<any>{
        let appMnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`
        let appId = `${process.env.REACT_APP_APPLICATION_ID}`

        let appDid =  await this.getDid(appMnemonic)
        let userDid =  await this.getDid(userMnemonic)

        let vc = ElastosClient.didDocuments.createVerifiableCredentialVP(appDid, userDid, appId)
        return ElastosClient.didDocuments.createVerifiablePresentation(appDid, "VerifiablePresentation", vc, issuer, nonce)
    }
}