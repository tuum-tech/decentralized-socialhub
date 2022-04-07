import {
  DefaultDIDAdapter,
  DID,
  DIDBackend,
  DIDDocument,
  DIDStore,
  DIDURL,
  HDKey,
  Issuer,
  Mnemonic,
  RootIdentity,
  VerifiableCredential,
  VerifiablePresentation
} from '@elastosfoundation/did-js-sdk/';
import { DID as CNDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { AssistService } from './assist.service';

export interface IDidService {
  loadDid(mnemonic: string, password: string): Promise<DID>;
  generateNewMnemonics(): Promise<string>;

  /* Creates and returns new RootIdentity object*/
  newRootIdentity(mnemonics: string): RootIdentity;
  addRootIdentityToStore(rootIdentity: RootIdentity): void;

  /* 
  Create, store and returns RootIdentity
  */
  storeNewRootIdentity(mnemonics: string): RootIdentity;

  /* Creates and returns new DIDDocument from RootIdentity
  if RootIdentity parameter is not passed, default RootIdentity will be used
  */
  newDIDDocument(RootIdentity?: RootIdentity): Promise<DIDDocument>;

  /* Add DidDocument to the store */
  storeDocument(didDocument: DIDDocument): void;

  /* 
  Create, store and returns DIDDocument
  */
  storeNewDIDDocument(RootIdentity?: RootIdentity): Promise<DIDDocument>;

  /* Creates and returns new Self Verifiable Credential from the parameters */
  newSelfVerifiableCredential(
    didDocument: DIDDocument,
    subjectName: string,
    subjectValue: any
  ): Promise<VerifiableCredential>;

  storeNewSelfVerifiableCredential(
    didDocument: DIDDocument,
    subjectName: string,
    subjectValue: any
  ): Promise<VerifiableCredential>;

  /* 
  Returns the DIDDocument from the DIDStore
  */
  getStoredDocument(did: any): Promise<DIDDocument>;

  /* 
  Returns the DIDDocument from the Blockchain
  */
  getPublishedDocument(did: any): Promise<DIDDocument>;

  /* 
  isDocumentSynchronized(did: DID) : Promise<boolean>;
  
  /* returns true if did is already published */
  isDIDPublished(did: string): Promise<boolean>;

  publishDocument(didDocument: DIDDocument): Promise<void>;

  addVerifiableCredentialToDIDDocument(
    diddocument: DIDDocument,
    vc: VerifiableCredential
  ): Promise<DIDDocument>;

  addServiceToDIDDocument(
    diddocument: DIDDocument,
    did: DID,
    type: string,
    endpoint: string
  ): Promise<DIDDocument>;

  generateService(did: DID, type: string, endpoint: string): any;

  generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<VerifiablePresentation>;
}

export enum PublishRequestOperation {
  Create = 'create',
  Update = 'update'
}

export class DidService implements IDidService {
  static InitializeMainnet() {
    DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
  }
  public Store: DIDStore;

  constructor(store: DIDStore) {
    this.Store = store;
  }

  public static getInstance = async () => {
    let store = await DIDStore.open(
      process.env.REACT_APP_DID_STORE_PATH as string
    );
    const me = new DidService(store);

    return me;
  };

  getFromStore = async (
    mnemonic: string,
    password: string
  ): Promise<RootIdentity | null> => {
    let id = RootIdentity.getIdFromMnemonic(mnemonic, password);

    if (id !== undefined) {
      return this.Store.loadRootIdentity(id);
    }

    return null;
  };

  isMnemonicsValid = (mnemonic: string): boolean => {
    return Mnemonic.checkIsValid(mnemonic);
  };

  getPrivateKey = async (did: string): Promise<string> => {
    let didDocument = await this.Store.loadDid(did);
    let privatekey = didDocument.derive(0, 'passw');
    return privatekey;
  };

  loadDid = async (
    mnemonic: string,
    password: string = '',
    index: number = 0
  ): Promise<DID> => {
    let identity = await this.getFromStore(mnemonic, password);
    let rootIdentity: RootIdentity;

    if (identity === null) {
      rootIdentity = RootIdentity.createFromMnemonic(
        mnemonic,
        password,
        this.Store,
        process.env.REACT_APP_DID_STORE_PASSWORD as string,
        true
      );

      this.Store.storeRootIdentity(rootIdentity);
    } else {
      rootIdentity = identity as RootIdentity;
    }

    let did = rootIdentity.getDid(index);
    let didDocument = await this.Store.loadDid(did);

    if (didDocument === null) {
      let docOnBlockchain = await did.resolve();
      if (docOnBlockchain === null) {
        console.error('DID not published');
      } else {
        await this.Store.storeDid(docOnBlockchain);
        await this.storePrivatekey(
          DIDURL.from('#primary', did) as DIDURL,
          mnemonic,
          password,
          0
        );
      }
    }

    return did;
  };

  async storePrivatekey(
    id: DIDURL,
    mnemonics: string,
    password: string,
    index: number
  ): Promise<void> {
    let storePassw = process.env.REACT_APP_DID_STORE_PASSWORD as string;

    let key = HDKey.newWithMnemonic(mnemonics, password).deriveWithPath(
      HDKey.DERIVE_PATH_PREFIX + index
    );

    this.Store.storePrivateKey(id as DIDURL, key.serialize(), storePassw);
  }

  async generateNewMnemonics(): Promise<string> {
    let mnemonics = Mnemonic.getInstance();
    let mnemonicsString = mnemonics.generate();

    return mnemonicsString;
  }

  newRootIdentity(mnemonics: string): RootIdentity {
    let newRootId = RootIdentity.createFromMnemonic(
      mnemonics,
      '',
      this.Store,
      process.env.REACT_APP_DID_STORE_PASSWORD as string,
      true
    );

    return newRootId;
  }

  addRootIdentityToStore(rootIdentity: RootIdentity) {
    this.Store.storeRootIdentity(
      rootIdentity,
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );
  }

  storeNewRootIdentity(mnemonics: string): RootIdentity {
    let newRootId = this.newRootIdentity(mnemonics);
    //this.addRootIdentityToStore(newRootId);
    return newRootId;
  }

  getDidDocument = async (
    did: any,
    useCache: boolean = true
  ): Promise<DIDDocument> => {
    let didDocument = await this.Store.loadDid(did);
    return didDocument;
  };

  isDIDPublished = async (did: string): Promise<boolean> => {
    let didObject = new DID(did);
    let document = await didObject.resolve(true);
    return document && document !== undefined;
  };

  async newDIDDocument(rootIdentity: RootIdentity): Promise<DIDDocument> {
    return await rootIdentity.newDid(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );
  }

  async storeNewDIDDocument(rootIdentity: RootIdentity): Promise<DIDDocument> {
    let didDocument = await this.newDIDDocument(rootIdentity);
    this.Store.storeDid(didDocument);
    return didDocument;
  }

  async getStoredDocument(did: DID): Promise<DIDDocument> {
    return await this.Store.loadDid(did);
  }

  async getPublishedDocument(did: DID): Promise<DIDDocument> {
    return did.resolve(true);
  }

  async storeDocument(didDocument: DIDDocument) {
    this.Store.storeDid(didDocument);
  }

  async isDocumentSynchronized(did: DID): Promise<boolean> {
    return (
      (await this.getStoredDocument(did)).toString(true) ===
      (await this.getPublishedDocument(did)).toString(true)
    );
  }

  async publishDocument(didDocument: DIDDocument): Promise<void> {
    // eslint-disable-next-line
    let response: any = {};
    let adapter: any = {
      createIdTransaction: async (payload: any, memo: any) => {
        let request = JSON.parse(payload);
        let did = request.proof.verificationMethod;
        did = did.substring(0, did.indexOf('#'));
        response = await AssistService.publishDocument(did, request);
      }
    };

    didDocument.publish(
      process.env.REACT_APP_DID_STORE_PASSWORD as string,
      undefined,
      true,
      adapter
    );
  }

  async addVerifiableCredentialToDIDDocument(
    diddocument: DIDDocument,
    vc: VerifiableCredential
  ): Promise<DIDDocument> {
    let builder = DIDDocument.Builder.newFromDocument(diddocument);
    builder.edit();
    return await builder
      .addCredential(vc)
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
  }

  async updateMultipleVerifiableCredentialsToDIDDocument(
    diddocument: DIDDocument,
    vcs: VerifiableCredential[],
    toRemove: string[] | undefined = undefined
  ): Promise<DIDDocument> {
    let builder = DIDDocument.Builder.newFromDocument(diddocument);

    builder.edit();
    vcs.forEach(vc => {
      if (diddocument.credentials?.has(vc.getId())) {
        builder.removeCredential(vc.getId());
      }
      builder.addCredential(vc);
    });

    if (toRemove && toRemove.length > 0) {
      toRemove.forEach(value => {
        let vcurlid = new DIDURL(value);
        if (diddocument.credentials?.has(vcurlid)) {
          builder.removeCredential(vcurlid);
        }
      });
    }

    return await builder.seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );
  }

  async removeMultipleVerifiableCredentialsToDIDDocument(
    diddocument: DIDDocument,
    vcsId: string[]
  ): Promise<DIDDocument> {
    let builder = DIDDocument.Builder.newFromDocument(diddocument);
    builder.edit();

    vcsId.forEach(vc => {
      let vcidurl = new DIDURL(vc);
      if (diddocument.credentials?.has(vcidurl)) {
        builder.removeCredential(vcidurl);
      }
    });

    return await builder.seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );
  }

  async addVerifiableCredentialToEssentialsDIDDocument(
    diddocument: DIDDocument,
    vc: VerifiableCredential
  ): Promise<DIDDocument> {
    if (diddocument.proofs?.size! > 0) {
      diddocument.proofs?.clear();
    }

    if (diddocument.credentials?.has(vc.getId())) {
      diddocument.credentials.delete(vc.getId());
    }

    diddocument.credentials?.set(vc.getId(), vc);

    return diddocument;
  }

  async addServiceToDIDDocument(
    diddocument: DIDDocument,
    did: DID,
    type: string,
    endpoint: string
  ): Promise<DIDDocument> {
    let builder = DIDDocument.Builder.newFromDocument(diddocument);
    builder.edit();
    let didUrl: DIDURL = DIDURL.from(`#${type}`, did) as DIDURL;
    builder.addService(didUrl, type, endpoint);
    return await builder.seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );

    //ElastosClient.didDocuments.addServiceToDIDDocument(diddocument, service);
  }

  async storeNewSelfVerifiableCredential(
    didDocument: DIDDocument,
    subjectName: string,
    subjectValue: any
  ): Promise<VerifiableCredential> {
    let newSelfVerifiableCred = await this.newSelfVerifiableCredential(
      didDocument,
      subjectName,
      subjectValue
    );
    this.Store.storeCredential(newSelfVerifiableCred);
    return newSelfVerifiableCred;
  }

  async newSelfVerifiableCredentialFromEssentials(
    did: string,
    subjectName: string,
    subjectValue: any
  ): Promise<VerifiableCredential> {
    let didAccess = new CNDID.DIDAccess();
    let property: any = {};
    property[subjectName] = subjectValue;

    return await didAccess.issueCredential(
      did,
      [subjectName],
      property,
      subjectName
    );
  }

  async newSelfVerifiableCredential(
    didDocument: DIDDocument,
    subjectName: string,
    subjectValue: any
  ): Promise<VerifiableCredential> {
    let did = didDocument.getSubject();

    let date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    let issuer = new Issuer(
      didDocument,
      DIDURL.from('#primary', didDocument.getSubject()) as DIDURL
    );

    let vcBuilder = new VerifiableCredential.Builder(
      issuer,
      didDocument.getSubject()
    );
    return await vcBuilder
      .expirationDate(date)
      .type('SelfProclaimedCredential')
      .property(subjectName, subjectValue)
      .id(DIDURL.from('#' + subjectName.toLowerCase(), did) as DIDURL)
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
  }

  generateService(did: DID, type: string, endpoint: string): any {
    // let oldService = ElastosClient.didDocuments.createService(
    //   did.did,
    //   type,
    //   endpoint
    // );

    // return oldService;
    throw new Error('not implemented');
  }

  async generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any> {
    let appMnemonic = process.env.REACT_APP_APPLICATION_MNEMONICS as string;
    let appDid = await this.loadDid(appMnemonic);
    let userDid = await this.loadDid(userMnemonic, password);

    let userDocument: DIDDocument = await this.Store.loadDid(userDid);

    // the storePrivateKey method should probably go to loadDid method
    let id: DIDURL = DIDURL.from('#primary', userDid) as DIDURL;
    await this.storePrivatekey(id, userMnemonic, password, 0);

    let id2: DIDURL = DIDURL.from('#primary', appDid) as DIDURL;
    await this.storePrivatekey(id2, userMnemonic, password, 0);

    let issuerObject = new Issuer(userDocument, id);
    let vcBuilder = new VerifiableCredential.Builder(issuerObject, appDid);
    let vc = await vcBuilder
      .expirationDate(this.getExpirationDate())
      .type('AppIdCredential')
      .property('appDid', appDid.toString())
      .property('appInstanceDid', appDid.toString())
      .id(DIDURL.from('#app-id-credential', appDid) as DIDURL)
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string); // and we sign so it creates a Proof with method and signature

    this.Store.storeCredential(vc);

    let vpb = await VerifiablePresentation.createFor(appDid, null, this.Store);
    let vp = await vpb
      .realm(issuer)
      .nonce(nonce)
      .credentials(vc)
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);

    return vp;
  }

  getExpirationDate() {
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 5, month, day);
    return c;
  }

  async generateVerifiablePresentationFromEssentialCred(
    issuer: string,
    nonce: string
  ): Promise<any> {
    let appMnemonic = process.env.REACT_APP_APPLICATION_MNEMONICS as string;
    let appDidInstance = await this.loadDid(appMnemonic);

    let didAccess = new CNDID.DIDAccess();
    let vc: VerifiableCredential = await didAccess.generateAppIdCredential();

    this.Store.storeCredential(vc);

    // store private key
    let id: DIDURL = DIDURL.from('#primary', appDidInstance) as DIDURL;
    this.storePrivatekey(id, appMnemonic, '', 0);
    let response = await didAccess.getExistingAppInstanceDIDInfo();
    let didStore = await DIDStore.open(response.storeId);

    let vpb = await VerifiablePresentation.createFor(
      response.didString,
      null,
      didStore
    );

    let vp = await vpb
      .realm(issuer)
      .nonce(nonce)
      .credentials(vc)
      .seal(response.storePassword);

    return vp;
  }
}
