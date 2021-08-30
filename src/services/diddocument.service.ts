import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { AssistService } from './assist.service';
import { DidService } from './did.service.new';
import { EventsService, IEventCallback } from './events.service';
import { EventEmitter } from 'events';
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

  private static eventEmmiter: EventEmitter = new EventEmitter();
  static listenDocumentChange(
    id: string,
    callbackMethod: (data: IDIDDocumentState) => void
  ) {}

  static unlistenDocumentChange(id: string) {
    EventsService.removeListener(this.DOCUMENT_CHANGE_EVENT, id);
  }

  private static triggerDocumentChangeEvent(documentstate: IDIDDocumentState) {
    DidDocumentService.eventEmmiter.emit(
      this.DOCUMENT_CHANGE_EVENT,
      documentstate
    );
  }

  private static getDocumentState(userDID: string): IDIDDocumentState | null {
    let json = window.localStorage.getItem(
      `${this.DIDDOCUMENT_KEY}_${userDID.replace('did:elastos:', '')}`
    );

    if (!json) return null;
    return JSON.parse(json);
  }

  static async isDidDocumentPublished(did: string): Promise<boolean> {
    let didService = await DidService.getInstance();
    let documentOnBlockchain = await didService.getDidDocument(did);

    return documentOnBlockchain !== null && documentOnBlockchain !== undefined;
  }

  static async getUserDocument(
    userSession: ISessionItem
  ): Promise<DIDDocument> {
    let document = await this.getUserDocumentByDid(userSession.did);
    return document;
  }

  static async getUserDocumentByDid(did: string): Promise<DIDDocument> {
    let didService = await DidService.getInstance();
    const documentState = await didService.getStoredDocument(new DID(did));
    return documentState;
  }

  private static async loadFromBlockchain(
    did: string
  ): Promise<DIDDocument | null> {
    let didService = await DidService.getInstance();
    let documentOnBlockchain = await didService.getPublishedDocument(
      new DID(did)
    );
    return documentOnBlockchain;
  }

  static async updateUserDocument(diddocument: DIDDocument): Promise<void> {
    let document = await this.loadFromBlockchain(
      diddocument.getSubject().toString()
    );

    let didService = await DidService.getInstance();
    didService.storeDocument(document as DIDDocument);
  }

  static async publishUserDocument(
    diddocument: DIDDocument,
    userSession: ISessionItem
  ): Promise<void> {
    let response: any = {};
    let adapter: any = {
      createIdTransaction: async (payload: any, memo: any) => {
        let request = JSON.parse(payload);
        let did = request.proof.verificationMethod;
        did = did.substring(0, did.indexOf('#'));
        response = await AssistService.publishDocument(did, request);

        console.log(response);
      }
    };
    diddocument.publish(
      process.env.REACT_APP_DID_STORE_PASSWORD as string,
      undefined,
      undefined,
      adapter
    );
  }

  static async reloadUserDocument(
    userSession: ISessionItem
  ): Promise<DIDDocument | null> {
    let document = await this.loadFromBlockchain(userSession.did);

    let didService = await DidService.getInstance();
    didService.storeDocument(document as DIDDocument);

    return document;
  }
}
