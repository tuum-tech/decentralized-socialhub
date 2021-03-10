import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';
import { Console } from 'console';
// import { DidcredsService } from './didcreds.service';
// import { AccountType } from './user.service';

export interface IDID {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  did: string;
}

export enum PublishRequestOperation{
  Create = "create",
  Update = "update"
}


export class DidService {
  static async loadDid(mnemonic: string, password: string = ''): Promise<IDID> {
    console.log("Mnemonic used", mnemonic)
    let didLoaded = await ElastosClient.did.loadFromMnemonic(mnemonic, password);
    console.log("DID loaded", didLoaded)
    return didLoaded
  }

  static async generateNew(): Promise<IDID> {
    let newDid = await ElastosClient.did.generateNew();
    console.log("NEW DID", newDid)
    return newDid
  }

  static async getDidDocument(did: any): Promise<any> {
    let document = await ElastosClient.didDocuments.getMostRecentDIDDocument(
      did
    );
    return document;
  }

  static async isDIDPublished(did: string): Promise<boolean> {
    let document = await this.getDidDocument(did);
    return document && document !== undefined;
  }

  static isSignedDIDDocumentValid(signedDocument: any, did:IDID): boolean {
     return ElastosClient.didDocuments.isValid(signedDocument, did)
  }

  static async genereteNewDidDocument(did: IDID): Promise<any> {
    let document = ElastosClient.didDocuments.newDIDDocument(did);
    return document;
  }

  static sealDIDDocument(did: IDID, diddocument: any) {
    let isValid = false
    while (!isValid){
      if (diddocument.hasOwnProperty("proof")) {
        delete diddocument.proof
      }
      ElastosClient.didDocuments.sealDocument(did, diddocument);
      isValid = ElastosClient.didDocuments.isValid(diddocument, did)
      console.log("sealed DIDDocument is valid", isValid)
    }
  }

  static async addVerfiableCredentialToDIDDocument(diddocument: any, vc: any) {
    
    if (diddocument.hasOwnProperty("proof")) {
      delete diddocument.proof
    }

    ElastosClient.didDocuments.addVerfiableCredentialToDIDDocument(
      diddocument,
      vc
    );
  }

  static async addServiceToDIDDocument(diddocument: any, service: any) {
    
    if (diddocument.hasOwnProperty("proof")) {
      console.log("Remove proof")
      delete diddocument.proof
      console.log("Proof removed")
    }

    ElastosClient.didDocuments.addServiceToDIDDocument(
      diddocument,
      service
    );
  }



  static generateSelfVerifiableCredential(did: IDID, subjectName: string, subjectTypes: string[], subjectValue: any){
    return ElastosClient.didDocuments.createVerifiableCredential(did, did.did, subjectName, subjectTypes, subjectValue)
  }

  static generateService(did: IDID, type: string, endpoint: string){
    return ElastosClient.didDocuments.createService(did, did.did, type, endpoint)
  }

  static async generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any> {
    let appMnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    let appId = `${process.env.REACT_APP_APPLICATION_ID}`;

    let appDid = await this.loadDid(appMnemonic);
    let userDid = await this.loadDid(userMnemonic, password);

    let vc = ElastosClient.didDocuments.createVerifiableCredentialVP(
      appDid,
      userDid,
      appId
    );
    return ElastosClient.didDocuments.createVerifiablePresentation(
      appDid,
      'VerifiablePresentation',
      vc,
      issuer,
      nonce
    );
  }


  static async generatePublishRequest(diddocument: any, userDID: IDID, operation: PublishRequestOperation): Promise<any> {
    let isValid = false;
    let tx: any;
    while (!isValid) {
      tx = ElastosClient.idChainRequest.generateRequest(
        diddocument,
        userDID,
        `${operation}`
      );
      isValid = ElastosClient.idChainRequest.isValid(tx, userDID);
    }
    return tx;
  }
}
