import { DIDDocument } from '@elastosfoundation/did-js-sdk/typings';
import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';

export interface IDID {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  did: string;
}

export interface IDidService {
  loadDid(mnemonic: string, password: string): Promise<IDID>;
  generateNew(): Promise<IDID>;
  getDidDocument(did: any, useCache: boolean): Promise<any>;
  isDIDPublished(did: string): Promise<boolean>;
  isSignedDIDDocumentValid(signedDocument: any, did: IDID): boolean;
  genereteNewDidDocument(did: IDID): Promise<any>;
  sealDIDDocument(did: IDID, diddocument: any): any;
  addVerfiableCredentialToDIDDocument(diddocument: any, vc: any): any;
  addServiceToDIDDocument(
    diddocument: DIDDocument,
    did: IDID,
    type: string,
    endpoint: string
  ): Promise<DIDDocument>;
  generateSelfVerifiableCredential(
    did: IDID,
    subjectName: string,
    subjectTypes: string[],
    subjectValue: any
  ): any;
  generateService(did: IDID, type: string, endpoint: string): any;
  generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any>;
}

export enum PublishRequestOperation {
  Create = 'create',
  Update = 'update'
}

export class DidService {
  async loadDid(mnemonic: string, password: string = ''): Promise<IDID> {
    let didLoaded = await ElastosClient.did.loadFromMnemonic(
      mnemonic,
      password
    );
    return didLoaded;
  }

  async generateNew(): Promise<IDID> {
    let newDid = await ElastosClient.did.generateNew();

    return newDid;
  }

  async getDidDocument(did: any, useCache: boolean = true): Promise<any> {
    let document = await ElastosClient.didDocuments.getMostRecentDIDDocument(
      did,
      { useCache: useCache }
    );
    return document;
  }

  async isDIDPublished(did: string): Promise<boolean> {
    let document = await this.getDidDocument(did);
    return document && document !== undefined;
  }

  isSignedDIDDocumentValid(signedDocument: any, did: IDID): boolean {
    return ElastosClient.didDocuments.isValid(signedDocument, did);
  }

  async genereteNewDidDocument(did: IDID): Promise<any> {
    let document = ElastosClient.didDocuments.newDIDDocument(did);
    return document;
  }

  sealDIDDocument(did: IDID, diddocument: any): any {
    let isValid = false;
    let signedDocument: any;
    if (diddocument.hasOwnProperty('proof')) {
      delete diddocument.proof;
    }
    while (!isValid) {
      signedDocument = ElastosClient.didDocuments.sealDocument(
        did,
        diddocument
      );
      isValid = ElastosClient.didDocuments.isValid(signedDocument, did);
    }

    return signedDocument;
  }

  async addVerfiableCredentialToDIDDocument(diddocument: any, vc: any) {
    if (diddocument.hasOwnProperty('proof')) {
      delete diddocument.proof;
    }

    ElastosClient.didDocuments.addVerfiableCredentialToDIDDocument(
      diddocument,
      vc
    );
  }

  async addServiceToDIDDocument(diddocument: any, service: any) {
    if (diddocument.hasOwnProperty('proof')) {
      delete diddocument.proof;
    }

    ElastosClient.didDocuments.addServiceToDIDDocument(diddocument, service);
  }

  generateSelfVerifiableCredential(
    did: IDID,
    subjectName: string,
    subjectTypes: string[],
    subjectValue: any
  ) {
    return ElastosClient.didDocuments.createVerifiableCredential(
      did,
      did.did,
      subjectName,
      subjectTypes,
      subjectValue
    );
  }

  generateService(did: IDID, type: string, endpoint: string) {
    return ElastosClient.didDocuments.createService(did.did, type, endpoint);
  }

  async generateVerifiablePresentationFromUserMnemonics(
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

  async generatePublishRequest(
    diddocument: any,
    userDID: IDID,
    operation: PublishRequestOperation
  ): Promise<any> {
    let newItem: any = {};
    Object.getOwnPropertyNames(diddocument).forEach(function(key) {
      newItem[key] = diddocument[key];
    }, diddocument);

    let isValid = false;
    let tx: any;
    while (!isValid) {
      tx = await ElastosClient.idChainRequest.generateRequest(
        newItem,
        userDID,
        `${operation}`
      );
      isValid = ElastosClient.idChainRequest.isValid(tx, userDID);
    }
    return tx;
  }
}
