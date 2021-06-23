import {
  DefaultDIDAdapter,
  DID,
  DIDBackend,
  DIDDocument,
  DIDStore,
  RootIdentity
} from '@elastosfoundation/did-js-sdk/';

import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';
import { storefront } from 'ionicons/icons';
import { IDidService, IDID } from './did.service';

export enum PublishRequestOperation {
  Create = 'create',
  Update = 'update'
}

export class DidService implements IDidService {
  rootIdentity?: RootIdentity;
  store?: DIDStore;

  loadDid = async (mnemonic: string, password: string = ''): Promise<IDID> => {
    debugger;
    DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
    this.store = await DIDStore.open('/generated/tmp/DIDStore');
    this.rootIdentity = RootIdentity.createFromMnemonic(
      mnemonic,
      password,
      this.store,
      'passw',
      true
    );

    let did = this.rootIdentity.getDid(0);

    // Validate all
    let ret: IDID = {
      mnemonic: mnemonic,
      publicKey: this.rootIdentity.getPreDerivedPublicKey().serializeBase58(),
      privateKey: 'how',
      did: did.toString()
    };
    return ret;
  };

  async generateNew(): Promise<IDID> {
    let newDid = await ElastosClient.did.generateNew();

    return newDid;
  }

  getDidDocument = async (did: any, useCache: boolean = true): Promise<any> => {
    if (this.store?.containsDid(did)) {
      debugger;
    }
    let did2 = this.rootIdentity?.getDid(0);
    debugger;
    return await did2?.resolve();
  };

  isDIDPublished = async (did: string): Promise<boolean> => {
    let document: DIDDocument = await this.getDidDocument(did);
    return document && document !== undefined;
  };

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
