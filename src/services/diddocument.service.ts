import { stat } from "fs";
import { AssistService } from "./assist.service";
import { DidService } from "./did.service";
import { EventsService, IEventCallback } from "./events.service";
import { UserService } from "./user.service";

export interface IDIDDocumentState {
    diddocument: any;
    isChanged: boolean;
}

export interface IDocumentChangeCallback extends IEventCallback{
    callback<IDIDDocumentState>(data: IDIDDocumentState) : void
}

export class DidDocumentService {

    private static DOCUMENT_CHANGE_EVENT = "DocumentChangeEvent";

    static listenDocumentChange(id: string, callbackMethod: (data: IDIDDocumentState) => void){
        // let callbackItem :IDocumentChangeCallback = {
        //     callback: (data) =>{
        //         callbackMethod(data);
        //     }
        // }

        // EventsService.addListener(this.DOCUMENT_CHANGE_EVENT, id, callbackItem)
    }

    static unlistenDocumentChange(id: string){
        EventsService.removeListener(this.DOCUMENT_CHANGE_EVENT, id)
    }

    private static triggerDocumentChangeEvent(documentstate: IDIDDocumentState){
        EventsService.trigger(this.DOCUMENT_CHANGE_EVENT, documentstate)
    }

    private static getDocumentState() : IDIDDocumentState | null{
        let json = window.localStorage.getItem("user_diddocument")
        
        if (!json) return null;
        return JSON.parse(json)
    }

    private static setDocumentState(documentState: IDIDDocumentState){
        let json = JSON.stringify(documentState)
        window.localStorage.setItem("user_diddocument", json)
        this.triggerDocumentChangeEvent(documentState)
    }

    static async getUserDocument(): Promise<IDIDDocumentState> {
        let userSession = UserService.GetUserSession() 

        if (!userSession) {
            throw Error("Not logged")
        }

        let documentState = this.getDocumentState()
        if (documentState) return documentState

        documentState = await this.loadFromBlockchain(userSession.did)
        this.setDocumentState(documentState)

        return documentState
    }

    private static async loadFromBlockchain(did: string) : Promise<IDIDDocumentState>{
        let documentOnBlockchain = await DidService.getDidDocument(did)
        if (documentOnBlockchain){
            let documentState = {
                diddocument: documentOnBlockchain,
                isChanged: false
            }
            return documentState
        }
        return {
            diddocument: null,
            isChanged: false
        }
    }

    static updateUserDocument(diddocument: any) : IDIDDocumentState{
        let documentState: IDIDDocumentState = {
            diddocument: diddocument,
            isChanged: true
        }

        this.setDocumentState(documentState);

        return documentState;
    }

    static async publishUserDocument(diddocument: any) : Promise<IDIDDocumentState>  {
        let userSession = UserService.GetUserSession()
        if (!userSession) {
            throw Error("Not logged")
        }

        let userDid = await DidService.loadDid(userSession.mnemonics)
        
        let isValid = false;
        let signedDocument: any;
        while (!isValid)
        {
            signedDocument = JSON.parse(JSON.stringify(diddocument));
            DidService.sealDIDDocument(userDid, signedDocument)
            isValid = DidService.isSignedDIDDocumentValid(signedDocument, userDid)
        }

         

        let requestPub = await DidService.generatePublishRequest(signedDocument)
        let response = await AssistService.publishDocument(userDid.did, requestPub)
    
        window.localStorage.setItem(
          `publish_${response.confirmationId}`,
          JSON.stringify({
            confirmationId: response.confirmationId,
            status: response.requestStatus,
          })
        )

        let documentState = {
            diddocument: signedDocument,
            isChanged: false
        }

        this.setDocumentState( documentState)
        return documentState
      }

    static async reloadUserDocument() : Promise<IDIDDocumentState>{
        let userSession = UserService.GetUserSession()
        if (!userSession) {
            throw Error("Not logged")
        }

        let documentState = await this.loadFromBlockchain(userSession.did)
        this.setDocumentState(documentState)

        return documentState;
    }

}