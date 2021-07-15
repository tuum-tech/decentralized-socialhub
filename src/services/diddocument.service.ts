import { AssistService } from './assist.service';
import { DidService, PublishRequestOperation } from './did.service.new';
import { EventsService, IEventCallback } from './events.service';
export interface IDIDDocumentState {
  diddocument: any;
  isChanged: boolean;
}

export interface IDocumentChangeCallback extends IEventCallback {
  callback<IDIDDocumentState>(data: IDIDDocumentState): void;
}

export class DidDocumentService {
  private static DOCUMENT_CHANGE_EVENT = 'DocumentChangeEvent';
  private static DIDDOCUMENT_KEY = 'userdiddocument';

  static listenDocumentChange(
    id: string,
    callbackMethod: (data: IDIDDocumentState) => void
  ) {
    // let callbackItem :IDocumentChangeCallback = {
    //     callback: (data) =>{
    //         callbackMethod(data);
    //     }
    // }
    // EventsService.addListener(this.DOCUMENT_CHANGE_EVENT, id, callbackItem)
  }

  static unlistenDocumentChange(id: string) {
    EventsService.removeListener(this.DOCUMENT_CHANGE_EVENT, id);
  }

  private static triggerDocumentChangeEvent(documentstate: IDIDDocumentState) {
    EventsService.trigger(this.DOCUMENT_CHANGE_EVENT, documentstate);
  }

  private static getDocumentState(userDID: string): IDIDDocumentState | null {
    let json = window.localStorage.getItem(
      `${this.DIDDOCUMENT_KEY}_${userDID.replace('did:elastos:', '')}`
    );

    if (!json) return null;
    return JSON.parse(json);
  }

  private static setDocumentState(documentState: IDIDDocumentState) {
    let json = JSON.stringify(documentState);
    window.localStorage.setItem(
      `${this.DIDDOCUMENT_KEY}_${JSON.parse(
        documentState.diddocument
      ).id.replace('did:elastos:', '')}`,
      json
    );
    this.triggerDocumentChangeEvent(documentState);
  }

  static async isDidDocumentPublished(did: string): Promise<boolean> {
    let didService = new DidService();
    let documentOnBlockchain = await didService.getDidDocument(did);

    return documentOnBlockchain !== null && documentOnBlockchain !== undefined;
  }

  static async getUserDocument(
    userSession: ISessionItem
  ): Promise<IDIDDocumentState> {
    let documentState = this.getDocumentState(userSession.did);
    if (documentState) return documentState;

    documentState = await this.loadFromBlockchain(userSession.did);
    this.setDocumentState(documentState);

    return documentState;
  }

  static async getUserDocumentByDid(did: string): Promise<IDIDDocumentState> {
    const documentState = await this.loadFromBlockchain(did);
    // this.setDocumentState(documentState);
    return documentState;
  }

  private static async loadFromBlockchain(
    did: string
  ): Promise<IDIDDocumentState> {
    let didService = new DidService();
    let documentOnBlockchain = await didService.getDidDocument(did, false);
    if (documentOnBlockchain) {
      let documentState = {
        diddocument: documentOnBlockchain.toString(true),
        isChanged: false
      };
      return documentState;
    }
    return {
      diddocument: null,
      isChanged: false
    };
  }

  static updateUserDocument(diddocument: any): IDIDDocumentState {
    let documentState: IDIDDocumentState = {
      diddocument: diddocument,
      isChanged: true
    };

    this.setDocumentState(documentState);

    return documentState;
  }

  static async publishUserDocument(
    diddocument: any,
    userSession: ISessionItem
  ): Promise<IDIDDocumentState | undefined> {
    let didService = new DidService();
    let userDid = await didService.loadDid(userSession.mnemonics);
    let signedDocument = await didService.sealDIDDocument(userDid, diddocument);

    if (signedDocument.getProof()) {
      // alertError(null, 'The DID document was not signed');
      return;
    }

    let requestPub = await didService.generatePublishRequest(
      signedDocument,
      userDid,
      PublishRequestOperation.Update
    );

    await AssistService.publishDocument(userDid.did, requestPub);
    let documentState = {
      diddocument: signedDocument,
      isChanged: false
    };

    this.setDocumentState(documentState);
    return documentState;
  }

  static async reloadUserDocument(
    userSession: ISessionItem
  ): Promise<IDIDDocumentState | undefined> {
    let documentState = await this.loadFromBlockchain(userSession.did);
    this.setDocumentState(documentState);

    return documentState;
  }
}
