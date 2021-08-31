import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';

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
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { IDidService, IDID } from './did.service';

export class DidService implements IDidService {
  static InitializeMainnet() {
    DIDBackend.initialize(new DefaultDIDAdapter('mainnet'));
  }

  static getStore = async (): Promise<DIDStore> => {
    return await DIDStore.open(process.env.REACT_APP_DID_STORE_PATH as string);
  };

  getFromStore = async (
    mnemonic: string,
    password: string
  ): Promise<RootIdentity | null> => {
    let id = RootIdentity.getIdFromMnemonic(mnemonic, password);

    if (id !== undefined) {
      let store = await DidService.getStore();
      return store.loadRootIdentity(id);
    }

    return null;
  };

  isMnemonicsValid = (mnemonic: string): boolean => {
    return Mnemonic.checkIsValid(mnemonic);
  };

  loadDid = async (mnemonic: string, password: string = ''): Promise<IDID> => {
    let identity = await this.getFromStore(mnemonic, password);
    let rootIdentity: RootIdentity;
    let store = await DidService.getStore();
    if (identity === null) {
      rootIdentity = RootIdentity.createFromMnemonic(
        mnemonic,
        password,
        store,
        process.env.REACT_APP_DID_STORE_PASSWORD as string,
        true
      );

      store.storeRootIdentity(rootIdentity);
    } else {
      rootIdentity = identity as RootIdentity;
    }

    let did = rootIdentity.getDid(0);
    let didDocument = await store.loadDid(did);

    if (didDocument === null) store.storeDid(await did.resolve());

    let didLoaded = await ElastosClient.did.loadFromMnemonic(
      mnemonic,
      password
    );
    // Validate all
    let ret: IDID = {
      mnemonic: mnemonic,
      publicKey: didLoaded.publicKey,
      privateKey: didLoaded.privateKey,
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
      process.env.REACT_APP_DID_STORE_PASSWORD as string,
      true
    );
    store.setDefaultRootIdentity(newRootId);

    let did: DID = newRootId.getDid(0) as DID;
    //let key : HDKey = HDKey.newWithMnemonic(mnemonicsString, "");
    let didLoaded = await ElastosClient.did.loadFromMnemonic(
      mnemonicsString,
      ''
    );

    let ret: IDID = {
      mnemonic: mnemonicsString as string,
      publicKey: didLoaded.publicKey,
      privateKey: didLoaded.privateKey,
      did: did.toString()
    };
    return ret;
  }

  getDidDocument = async (
    did: any,
    useCache: boolean = true
  ): Promise<DIDDocument> => {
    let store = await DidService.getStore();
    let didDocument = await store.loadDid(did);
    return didDocument;
  };

  isDIDPublished = async (did: string): Promise<boolean> => {
    let didObject = new DID(did);
    let document = await didObject.resolve(true);
    return document && document !== undefined;
  };

  isSignedDIDDocumentValid(signedDocument: any, did: IDID): boolean {
    throw new Error('not implemented');
  }

  async genereteNewDidDocument(did: IDID): Promise<any> {
    let store = await DidService.getStore();
    let rootIdentity = await store.loadRootIdentity();
    let didDocument = await rootIdentity.newDid(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );
    store.storeDid(didDocument);
    return didDocument;
  }

  async sealDIDDocument(
    did: IDID,
    diddocument: DIDDocument
  ): Promise<DIDDocument> {
    let signedDocument: DIDDocument;
    if (diddocument.hasOwnProperty('proof')) {
      diddocument.proofs?.clear();
    }
    let didDocBuilder = await DIDDocumentBuilder.newFromDocument(diddocument);
    signedDocument = await didDocBuilder.seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );

    return signedDocument as any;
  }

  async addVerfiableCredentialToDIDDocument(
    diddocument: DIDDocument,
    vc: VerifiableCredential
  ): Promise<DIDDocument> {
    if (diddocument.getProof()) {
      diddocument.proofs?.clear();
    }

    let store = await DidService.getStore();
    store.storeDid(diddocument);
    let d = await store.loadDid(diddocument.getSubject() as DID);

    let didDocBuilder = await DIDDocumentBuilder.newFromDocument(d);
    didDocBuilder = didDocBuilder.addCredential(vc);

    diddocument = await didDocBuilder.seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );

    return diddocument;
  }

  async addServiceToDIDDocument(
    diddocument: DIDDocument,
    did: IDID,
    type: string,
    endpoint: string
  ): Promise<DIDDocument> {
    let builder = DIDDocumentBuilder.newFromDocument(diddocument);
    let didUrl: DIDURL = DIDURL.from(
      `#${type}`,
      DID.from(did.did as string) as DID
    ) as DIDURL;
    builder.addService(didUrl, type, endpoint);
    return await builder.seal('passw');

    //ElastosClient.didDocuments.addServiceToDIDDocument(diddocument, service);
  }

  async generateSelfVerifiableCredential(
    did: IDID,
    subjectName: string,
    subjectTypes: string[],
    subjectValue: any
  ) {
    let store = await DidService.getStore();
    let didDocument = await store.loadDid(did.did);

    let date = new Date();
    date.setFullYear(date.getFullYear() + 5);
    let issuer = new Issuer(
      didDocument,
      DIDURL.from('#primary', DID.from(did.did) as DID) as DIDURL
    );
    let vcBuilder = new VerifiableCredential.Builder(
      issuer,
      didDocument.getSubject()
    );

    let vc = await vcBuilder
      .expirationDate(date)
      .type('SelfProclaimedCredential')
      .property(subjectName, subjectValue)
      .id(DIDURL.from('#primary', DID.from(did.did) as DID) as DIDURL)
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
    return vc;
  }

  generateService(did: IDID, type: string, endpoint: string): any {
    let oldService = ElastosClient.didDocuments.createService(
      did.did,
      type,
      endpoint
    );
    // let didUrl: DIDURL = DIDURL.from('#primary', DID.from(did.did as string) as DID) as DIDURL;
    // return new DIDDocumentService(didUrl, type, endpoint);
    return oldService;
  }

  async generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any> {
    let appMnemonic = process.env.REACT_APP_APPLICATION_MNEMONICS as string;
    let appId = process.env.REACT_APP_APPLICATION_ID;
    let appDid = await this.loadDid(appMnemonic); // returns object that have did, private key, public key, mnemonics for the app entity (Profile)

    let store = await DidService.getStore(); // get reference to store (which in profile's case is saved on browse local storage)
    let userDid = await this.loadDid(userMnemonic, password); // returns object that have did, private key, public key, mnemonics for the user

    let userDocument: DIDDocument = await store.loadDid(userDid.did); //  gets the user DIDDocument from the store, which was stored in another step

    let key = HDKey.newWithMnemonic(userMnemonic, password); // this step (form here to line 269) is the most confusing to me, AFAIK we have to create a private key

    // for the user and store it on the DidStore, or else the next step "new Issuer"  will fail

    let id: DIDURL = DIDURL.from(
      '#primary',
      DID.from(userDid.did as string) as DID
    ) as DIDURL;
    store.storePrivateKey(
      id as DIDURL,
      key.serialize(),
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );

    let id2: DIDURL = DIDURL.from(
      '#primary',
      DID.from(appDid.did as string) as DID
    ) as DIDURL;
    store.storePrivateKey(
      id2 as DIDURL,
      key.serialize(),
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );

    let issuerObject = new Issuer(userDocument, id); // to create a VerifiableCredential we need to use the VerifiableCredential.Builder
    let vcBuilder = new VerifiableCredential.Builder( // to initialize the builder we need the Issuer (which is the user) and the target, which is the app
      issuerObject,
      DID.from(appDid.did) as DID
    );
    let vc = await vcBuilder // then we just create the VerifiableCredential
      .expirationDate(new Date('2026-01-01'))
      .type('AppIdCredential') // with the type expected by Hive Node
      .property('appDid', appDid.did) // and the properties also he is expecting
      .property('appInstanceDid', appDid.did)
      .id(
        DIDURL.from('#app-id-credential', DID.from(appDid.did) as DID) as DIDURL
      )
      .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string); // and we sign so it creates a Proof with method and signature

    store.storeCredential(vc); // then we store the credential on DidStore

    let pb = await VerifiablePresentation.createFor(appDid.did, null, store); // then we create a VerifiablePresentation, which is a way to share some of
    let vp2 = await pb.realm(issuer); // the users credentials with someone, here basically the user wants to
    let vp3 = await vp2.nonce(nonce); // share with hive node that he has a credential to access a his vault
    let vp4 = await vp3.credentials(vc); // Here we add the credential to the presentation
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let vp5 = await vp4.seal(
      // We sign the presentation
      process.env.REACT_APP_DID_STORE_PASSWORD as string // Hive node will check if the presentation and the VerifiableCredential
    ); // are valid and give a token so the user can perform operations on his vault

    console.error('is Valid:' + (await vp5.isValid()));

    // ******************************************
    // TEMPORARY CODE: using old elastos js sdk while fixing new did-js-sdk issue
    let vcold = ElastosClient.didDocuments.createVerifiableCredentialVP(
      appDid,
      userDid,
      appId
    );

    let vpold = ElastosClient.didDocuments.createVerifiablePresentation(
      appDid,
      'VerifiablePresentation',
      vcold,
      issuer,
      nonce
    );
    return vpold;
    // ******************************************

    // console.error("********************");
    // console.error("OLD VP:"+JSON.stringify(vpold));
    // console.error("********************");
    // console.error("NEW VP:"+JSON.parse(vp5.toString(true)));
    //return JSON.parse(vp5.toString(true));
  }
  async generateVerifiablePresentationFromEssentialCred(
    issuer: string,
    nonce: string
  ): Promise<any> {
    let appMnemonic = process.env.REACT_APP_APPLICATION_MNEMONICS as string;
    let appDid = await this.loadDid(appMnemonic);

    let connector = connectivity.getActiveConnector();
    let vc = await connector?.generateAppIdCredential(
      process.env.REACT_APP_APPLICATION_DID as string,
      process.env.REACT_APP_APPLICATION_DID as string
    );
    console.log(await vc.isValid());

    let vpold = ElastosClient.didDocuments.createVerifiablePresentation(
      appDid,
      'VerifiablePresentation',
      JSON.parse(vc.toString(true)),
      issuer,
      nonce
    );
    return vpold;
  }
}
