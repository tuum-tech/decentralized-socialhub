import {
  DefaultDIDAdapter,
  DID,
  DIDBackend,
  DIDDocument,
  DIDDocumentBuilder,
  DIDStore,
  DIDURL,
  HDKey,
  Issuer,
  Mnemonic,
  RootIdentity,
  VerifiableCredential,
  VerifiablePresentation
} from '@elastosfoundation/did-js-sdk/';

import { IDidService, IDID } from './did.service';
import { DidcredsService } from './didcreds.service';

export enum PublishRequestOperation {
  Create = 'create',
  Update = 'update'
}

export class DidService implements IDidService {
  static InitializeMainnet() {
    DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
  }

  static getStore = async (): Promise<DIDStore> => {
    return await DIDStore.open(process.env.REACT_APP_DID_STORE_PATH as string);
  };

  loadDid = async (mnemonic: string, password: string = ''): Promise<IDID> => {
    let store = await DidService.getStore();
    let rootIdentity = RootIdentity.createFromMnemonic(
      mnemonic,
      password,
      store,
      process.env.REACT_APP_DID_STORE_PASSWORD as string,
      true
    );

    let did = rootIdentity.getDid(0);
    let didDocument = await did.resolve(true);
    store.storeRootIdentity(rootIdentity);
    store.storeDid(didDocument);

    // Validate all
    let ret: IDID = {
      mnemonic: mnemonic,
      publicKey: rootIdentity.getPreDerivedPublicKey().serializeBase58(),
      privateKey: 'how',
      did: did.toString()
    };
    return ret;
  };

  async generateNew(): Promise<IDID> {
    let mnemonics = Mnemonic.getInstance();
    let mnemonicsString = mnemonics.generate();
    let store = await DidService.getStore();

    let newRootId = RootIdentity.createFromMnemonic(
      mnemonicsString,
      '',
      store,
      'passw',
      true
    );
    store.setDefaultRootIdentity(newRootId);

    let did: DID = newRootId.getDid(0) as DID;

    let ret: IDID = {
      mnemonic: mnemonicsString as string,
      publicKey: newRootId.getPreDerivedPublicKey().serializeBase58(),
      privateKey: 'how',
      did: did.toString()
    };
    return ret;
  }

  getDidDocument = async (
    did: any,
    useCache: boolean = true
  ): Promise<DIDDocument> => {
    let store = await DidService.getStore();
    let rootIdentity = await store.loadRootIdentity();
    let didRoot = rootIdentity.getDid(0) as DID;
    let didDocument = await didRoot.resolve();

    //await store.storeDid(didDocument);

    return didDocument;
  };

  isDIDPublished = async (did: string): Promise<boolean> => {
    let document: DIDDocument = await this.getDidDocument(did);
    return document && document !== undefined;
  };

  isSignedDIDDocumentValid(signedDocument: any, did: IDID): boolean {
    debugger;
    throw new Error('not implemented');
  }

  async genereteNewDidDocument(did: IDID): Promise<any> {
    debugger;
    let store = await DidService.getStore();
    let rootIdentity = await store.loadRootIdentity();
    let didDocument = await rootIdentity.newDid('passw');
    store.storeDid(didDocument);
    return didDocument;
  }

  async sealDIDDocument(did: IDID, diddocument: DIDDocument): Promise<any> {
    let signedDocument: DIDDocument;
    if (diddocument.hasOwnProperty('proof')) {
      diddocument.proofs?.clear();
    }
    let didDocBuilder = await DIDDocumentBuilder.newFromDocument(diddocument);
    signedDocument = await didDocBuilder.seal('passw');

    return signedDocument as any;
  }

  async addVerfiableCredentialToDIDDocument(
    diddocument: DIDDocument,
    vc: VerifiableCredential
  ) {
    debugger;
    if (diddocument.getProof()) {
      diddocument.proofs?.clear();
    }

    let didDocBuilder = await DIDDocumentBuilder.newFromDocument(diddocument);
    didDocBuilder.addCredential(vc);

    diddocument = await didDocBuilder.seal('passw');
  }

  async addServiceToDIDDocument(diddocument: any, service: any) {
    // if (diddocument.hasOwnProperty('proof')) {
    //   delete diddocument.proof;
    // }

    // ElastosClient.didDocuments.addServiceToDIDDocument(diddocument, service);
    debugger;
    throw new Error('not implemented');
  }

  async generateSelfVerifiableCredential(
    did: IDID,
    subjectName: string,
    subjectTypes: string[],
    subjectValue: any
  ) {
    let store = await DidService.getStore();

    let rootIdentity = await store.loadRootIdentity();
    let userDid = rootIdentity.getDid(0);
    let didDocument = await store.loadDid(userDid);

    let date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    let issuer = new Issuer(
      didDocument,
      DIDURL.from('#primary', DID.from(did.did) as DID) as DIDURL
    );
    let vcBuilder = new VerifiableCredential.Builder(issuer, userDid);

    let vc = await vcBuilder
      .expirationDate(date)
      .type('SelfProclaimedCredential')
      .property(subjectName, subjectValue)
      .id(DIDURL.from('#primary', DID.from(did.did) as DID) as DIDURL)
      .seal('passw');

    // "{\"id\":\"did:elastos:ihCrDqWGpmnx9JmhxJcw9H7aWEc5CBTqzX#primary\",\"type\":[\"SelfProclaimedCredential\"],\"issuer\":\"did:elastos:ihCrDqWGpmnx9JmhxJcw9H7aWEc5CBTqzX\",\"issuanceDate\":\"2021-07-13T15:47:43Z\",\"expirationDate\":\"2026-07-13T15:47:27Z\",\"credentialSubject\":{\"id\":\"did:elastos:ihCrDqWGpmnx9JmhxJcw9H7aWEc5CBTqzX\",\"name\":\"asdc\"},\"proof\":{\"type\":\"ECDSAsecp256r1\",\"created\":\"2021-07-13T15:47:43Z\",\"verificationMethod\":\"did:elastos:ihCrDqWGpmnx9JmhxJcw9H7aWEc5CBTqzX#primary\",\"signature\":\"omfXO_dt_-nD4I8tQvGq-5AZZOOdysmCWCx3rFWQczVrZhoSl13vf_pCJMgZgudD7UyWG7Yv_BC9cfWxMySQxQ\"}}"

    return vc;
  }

  generateService(did: IDID, type: string, endpoint: string) {
    debugger;
    //return ElastosClient.didDocuments.createService(did.did, type, endpoint);
    throw new Error('not implemented');
  }

  async generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any> {
    let appMnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    //let appId = `${process.env.REACT_APP_APPLICATION_ID}`;
    let appDid = await this.loadDid(appMnemonic);

    let store = await DidService.getStore();
    let userDid = await this.loadDid(userMnemonic, password);

    let diddoc: DIDDocument = await store.loadDid(appDid.did);
    store.storeDid(diddoc);

    let key = HDKey.newWithMnemonic(userMnemonic, password);
    let id: DIDURL = DIDURL.from('#primary', diddoc.getSubject()) as DIDURL;
    store.storePrivateKey(
      id as DIDURL,
      key.serialize(),
      `${process.env.REACT_APP_DID_STORE_PASSWORD}`
    );
    let pb = await VerifiablePresentation.createFor(appDid.did, null, store);
    let subject = new VerifiableCredential.Subject(DID.from(appDid.did) as DID);
    subject.setProperty('appDid', appDid.did);
    subject.setProperty('appInstanceDid', appDid.did);
    let vc = new VerifiableCredential();
    vc.issuanceDate = new Date();
    vc.type = ['AppIdCredential'];
    vc.subject = subject;
    vc.id = DIDURL.from(
      '#app-id-credential',
      DID.from(userDid.did) as DID
    ) as DIDURL;
    vc.expirationDate = new Date('2022-01-01'); // TODO: get the right Date
    vc.issuer = DID.from(userDid.did) as DID;

    // ?
    store.storeCredential(vc);

    let vp = await pb
      .id(id)
      .realm(issuer)
      .nonce(nonce)
      .credentials(vc)
      .seal(`${process.env.REACT_APP_DID_STORE_PASSWORD}`);

    return vp.toString(true);

    // "{\"type\":\"VerifiablePresentation\",\"created\":\"2021-07-12T18:46:18Z\",\"verifiableCredential\":[{\"id\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX#app-id-credential\",\"type\":[\"AppIdCredential\"],\"issuer\":\"did:elastos:iq71KHN1LTK2KYoHP2jgZg8Zw2jQgpNUjr\",\"issuanceDate\":\"2021-07-12T18:46:18Z\",\"expirationDate\":\"2026-07-12T18:46:18Z\",\"credentialSubject\":{\"id\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"appDid\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"appInstanceDid\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\"},\"proof\":{\"type\":\"ECDSAsecp256r1\",\"verificationMethod\":\"did:elastos:iq71KHN1LTK2KYoHP2jgZg8Zw2jQgpNUjr#primary\",\"signature\":\"fiVrAAc6Z0DJYEcJLGcN2pUEyrnt84jZ9cAQG4ak8eNgP9-Xnv5UVETHSJRqhZiOyLGWlp_IQdpRj4JiJsDF5w\"}}],\"proof\":{\"type\":\"ECDSAsecp256r1\",\"verificationMethod\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX#primary\",\"realm\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"nonce\":\"7145f366-e341-11eb-9d23-0242ac130003\",\"signature\":\"zJN1X9bFHDRa4P5-cva7Az-jbxPTGkltpD5PO8o6AUtQtnjqBxjHblDENARYmIhVcI9T0-QxpGj5vIjZ4ICvrQ\"}}"
    // "{\"id\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX#primary\",\"type\":\"VerifiablePresentation\",\"holder\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"created\":\"2021-07-12T19:57:09Z\",\"verifiableCredential\":[{\"id\":\"did:elastos:iq71KHN1LTK2KYoHP2jgZg8Zw2jQgpNUjr#app-id-credential\",\"type\":[\"AppIdCredential\"],\"issuer\":\"did:elastos:iq71KHN1LTK2KYoHP2jgZg8Zw2jQgpNUjr\",\"issuanceDate\":\"2021-07-12T19:57:06Z\",\"expirationDate\":\"2022-01-01T00:00:00Z\",\"credentialSubject\":{\"id\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"appDid\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"appInstanceDid\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\"}}],\"proof\":{\"type\":\"ECDSAsecp256r1\",\"verificationMethod\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX#primary\",\"realm\":\"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX\",\"nonce\":\"525002bc-e34b-11eb-9d23-0242ac130003\",\"signature\":\"L3VZazNjUMmaj8FvaY_gQPq7Wq3ztV16r0COSIAP5b-HwlLRizmKen7umZzgvPbNArfpBOSYHG-SNRqViDiwKg\"}}"
  }

  async generatePublishRequest(
    diddocument: any,
    userDID: IDID,
    operation: PublishRequestOperation
  ): Promise<any> {
    debugger;
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
