import {
  DefaultDIDAdapter,
  DID,
  DIDBackend,
  DIDDocument,
  DIDStore,
  RootIdentity
} from '@elastosfoundation/did-js-sdk/';

import { IDidService, IDID } from './did.service';

export enum PublishRequestOperation {
  Create = 'create',
  Update = 'update'
}

export class DidService implements IDidService {
  rootIdentity?: RootIdentity;
  store?: DIDStore;

  static InitializeMainnet() {
    DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
  }

  loadDid = async (mnemonic: string, password: string = ''): Promise<IDID> => {
    this.store = await DIDStore.open(
      process.env.REACT_APP_DID_STORE_PATH as string
    );
    this.rootIdentity = RootIdentity.createFromMnemonic(
      mnemonic,
      password,
      this.store,
      process.env.REACT_APP_DID_STORE_PASSWORD as string,
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
    const ind: number = this.rootIdentity?.getIndex() as number;

    //let didDocument = this.rootIdentity?.newDid("passw",ind+1);
    let did: DID = this.rootIdentity?.getDid(ind + 1) as DID;

    let ret: IDID = {
      mnemonic: this.rootIdentity?.exportMnemonic('passw') as string,
      publicKey: this.rootIdentity
        ?.getPreDerivedPublicKey()
        .serializeBase58() as string,
      privateKey: 'how',
      did: did.toString()
    };

    return ret;
  }

  getDidDocument = async (did: any, useCache: boolean = true): Promise<any> => {
    let didRoot = this.rootIdentity?.getDid(0) as DID;
    return await didRoot.resolve();
  };

  isDIDPublished = async (did: string): Promise<boolean> => {
    let document: DIDDocument = await this.getDidDocument(did);
    return document && document !== undefined;
  };

  isSignedDIDDocumentValid(signedDocument: any, did: IDID): boolean {
    throw new Error('not implemented');
    //return ElastosClient.didDocuments.isValid(signedDocument, did);
  }

  async genereteNewDidDocument(did: IDID): Promise<any> {
    //let document = ElastosClient.didDocuments.newDIDDocument(did);
    throw new Error('not implemented');
    //return document;
  }

  sealDIDDocument(did: IDID, diddocument: any): any {
    // let isValid = false;
    // let signedDocument: any;
    // if (diddocument.hasOwnProperty('proof')) {
    //   delete diddocument.proof;
    // }
    // while (!isValid) {
    //   signedDocument = ElastosClient.didDocuments.sealDocument(
    //     did,
    //     diddocument
    //   );
    //   isValid = ElastosClient.didDocuments.isValid(signedDocument, did);
    // }

    // return signedDocument;
    throw new Error('not implemented');
  }

  async addVerfiableCredentialToDIDDocument(diddocument: any, vc: any) {
    // if (diddocument.hasOwnProperty('proof')) {
    //   delete diddocument.proof;
    // }

    // ElastosClient.didDocuments.addVerfiableCredentialToDIDDocument(
    //   diddocument,
    //   vc
    // );
    throw new Error('not implemented');
  }

  async addServiceToDIDDocument(diddocument: any, service: any) {
    // if (diddocument.hasOwnProperty('proof')) {
    //   delete diddocument.proof;
    // }

    // ElastosClient.didDocuments.addServiceToDIDDocument(diddocument, service);
    throw new Error('not implemented');
  }

  generateSelfVerifiableCredential(
    did: IDID,
    subjectName: string,
    subjectTypes: string[],
    subjectValue: any
  ) {
    // return ElastosClient.didDocuments.createVerifiableCredential(
    //   did,
    //   did.did,
    //   subjectName,
    //   subjectTypes,
    //   subjectValue
    // );
    throw new Error('not implemented');
  }

  generateService(did: IDID, type: string, endpoint: string) {
    //return ElastosClient.didDocuments.createService(did.did, type, endpoint);
    throw new Error('not implemented');
  }

  async generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any> {
    // let appMnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    // let appId = `${process.env.REACT_APP_APPLICATION_ID}`;
    // let appDid = await this.loadDid(appMnemonic);
    // let userDid = await this.loadDid(userMnemonic, password);

    // let vc = ElastosClient.didDocuments.createVerifiableCredentialVP(
    //   appDid,
    //   userDid,
    //   appId
    // );

    // return ElastosClient.didDocuments.createVerifiablePresentation(
    //   appDid,
    //   'VerifiablePresentation',
    //   vc,
    //   issuer,
    //   nonce
    // );
    throw new Error('not implemented');
  }

  async generatePublishRequest(
    diddocument: any,
    userDID: IDID,
    operation: PublishRequestOperation
  ): Promise<any> {
    // let newItem: any = {};
    // Object.getOwnPropertyNames(diddocument).forEach(function(key) {
    //   newItem[key] = diddocument[key];
    // }, diddocument);

    // let isValid = false;
    // let tx: any;
    // while (!isValid) {
    //   tx = await ElastosClient.idChainRequest.generateRequest(
    //     newItem,
    //     userDID,
    //     `${operation}`
    //   );
    //   isValid = ElastosClient.idChainRequest.isValid(tx, userDID);
    // }
    // return tx;

    throw new Error('not implemented');
  }
}
