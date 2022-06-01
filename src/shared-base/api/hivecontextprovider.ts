import {
  Claims,
  DID,
  DIDDocument,
  DIDStore,
  DIDURL,
  Issuer,
  JWTHeader,
  JWTParserBuilder,
  RootIdentity,
  VerifiableCredential,
  VerifiablePresentation,
  JWT
} from '@elastosfoundation/did-js-sdk/';
import {
  HiveException,
  AppContextProvider,
  AppContextParameters
} from '@elastosfoundation/hive-js-sdk/';
import dayjs from 'dayjs';
import { DidService } from 'src/services/did.service.new';
//import { HiveContextProviderException } from '../exceptions';
import { DID as CNDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { Logger } from '../logger';
import { UserDocumentNotPublishedException } from '../exceptions';

export class HiveContextProvider implements AppContextProvider {
  private static LOG = new Logger('HiveContextProvider');
  private contextParameters: AppContextParameters;

  private appRootId?: RootIdentity;
  private userRootId?: RootIdentity;
  private store?: DIDStore;

  constructor(contextParameters: AppContextParameters) {
    this.contextParameters = contextParameters;
  }

  public static async create(
    contextParameters: AppContextParameters
  ): Promise<AppContextProvider> {
    HiveContextProvider.LOG.trace('create');
    let defaultAppContext = new HiveContextProvider(contextParameters);

    await defaultAppContext.init();
    return defaultAppContext;
  }

  async init(): Promise<void> {
    HiveContextProvider.LOG.trace('init');
    this.store = await DIDStore.open(this.contextParameters.storePath);
    this.appRootId = await this.initPrivateIdentity(
      this.contextParameters.appMnemonics,
      this.contextParameters.appDID,
      this.contextParameters.appPhrasePass,
      this.contextParameters.appStorePass
    );
    HiveContextProvider.LOG.debug('Init app private identity');

    if (this.contextParameters.userMnemonics !== '') {
      this.userRootId = await this.initPrivateIdentity(
        this.contextParameters.userMnemonics,
        this.contextParameters.userDID,
        this.contextParameters.userPhrasePass,
        this.contextParameters.userStorePass
      );
      await this.initDid(this.userRootId);
    }
    HiveContextProvider.LOG.debug('Init user private identity');

    await this.initDid(this.appRootId);
  }

  public async initPrivateIdentity(
    mnemonic: string,
    did: string | DID,
    phrasePass: string,
    storePass: string
  ): Promise<RootIdentity> {
    HiveContextProvider.LOG.trace('initPrivateIdentity');
    HiveContextProvider.LOG.debug('Opens store');

    let id = RootIdentity.getIdFromMnemonic(mnemonic, phrasePass);

    HiveContextProvider.LOG.debug('ID from mnemonic {} : {}', mnemonic, id);

    if (this.store!.containsRootIdentity(id)) {
      HiveContextProvider.LOG.debug('Store constains RootIdentity');
      return await this.store!.loadRootIdentity(id);
    }

    let rootIdentity: RootIdentity;
    try {
      HiveContextProvider.LOG.info(
        'Creating root identity for mnemonic {}',
        mnemonic
      );
      rootIdentity = RootIdentity.createFromMnemonic(
        mnemonic,
        phrasePass,
        this.store!,
        storePass
      );
    } catch (e) {
      HiveContextProvider.LOG.error(
        'Error Creating root identity for mnemonic {}. Error {}',
        mnemonic,
        JSON.stringify(e)
      );
      throw new Error('Error Creating root identity for mnemonic');
    }

    await rootIdentity.synchronize();

    debugger;
    did = rootIdentity.getDid(0);
    let doc = await DID.from(did)?.resolve(true);
    await this.store?.storeDid(doc as DIDDocument);

    //let userDocument = await this.store?.loadDid(did);

    //this.store!.storeRootIdentity(rootIdentity, storePass);
    return rootIdentity;
  }

  public async initDid(rootIdentity: RootIdentity): Promise<void> {
    HiveContextProvider.LOG.trace('initDid');
    // let dids = await this.store!.listDids();
    // if (dids.length > 0) {
    //   this.contextParameters.appDID = dids[0];
    //   return;
    // }
    HiveContextProvider.LOG.debug('Init app did');

    //let did = await rootIdentity.getDefaultDid();

    let did: DID = DID.from(`${process.env.REACT_APP_APPLICATION_DID}`) as DID;
    let resolvedDoc = await did.resolve(true);
    await this.store!.storeDid(resolvedDoc);
    HiveContextProvider.LOG.debug('Resolve app doc');
  }

  getLocalDataDir(): string {
    HiveContextProvider.LOG.trace('getLocalDataDir');
    return this.contextParameters.storePath;
  }

  /**
   * The method for upper Application to implement to provide current application
   * instance did document as the running context.
   * @return The application instance did document.
   */
  async getAppInstanceDocument(): Promise<DIDDocument> {
    HiveContextProvider.LOG.trace('getAppInstanceDocument');
    return await this.getAppDocument();
  }

  /**
   * The method for upper Application to implement to acquire the authorization
   * code from user's approval.
   * @param authenticationChallengeJWtCode  The input challenge code from back-end node service.
   * @return The credential issued by user.
   */
  async getAuthorization(
    authenticationChallengeJWtCode: string
  ): Promise<string> {
    HiveContextProvider.LOG.trace('getAuthorization');
    try {
      let claims: Claims = (
        await new JWTParserBuilder()
          .build()
          .parse(authenticationChallengeJWtCode)
      ).getBody();
      if (claims == null)
        throw new HiveException('Invalid jwt token as authorization.');

      HiveContextProvider.LOG.debug('getAuthorization createPresentation');

      let presentation = this.contextParameters.userMnemonics
        ? await this.generateVerifiablePresentationFromUserMnemonics(
            this.contextParameters.userMnemonics,
            this.contextParameters.userPhrasePass,
            claims.getIssuer(),
            claims.get('nonce') as string
          )
        : await this.generateVerifiablePresentationFromEssentialCred(
            claims.getIssuer(),
            claims.get('nonce') as string
          );

      //TestData.LOG.debug("TestData->presentation: " + presentation.toString(true));
      return await this.createToken(presentation, claims.getIssuer());
    } catch (e) {
      HiveContextProvider.LOG.error(
        'TestData->getAuthorization error: {} stack {}',
        e,
        e.stack
      );
      //throw new HiveContextProviderException(e.message);
      return '';
    }
  }

  // Copied from did.service.new.ts
  private getExpirationDate() {
    HiveContextProvider.LOG.trace('getExpirationDate');
    var d = new Date();
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var c = new Date(year + 5, month, day);
    return c;
  }

  // Copied from did.service.new.ts
  private async generateVerifiablePresentationFromUserMnemonics(
    userMnemonic: string,
    password: string,
    issuer: string,
    nonce: string
  ): Promise<any> {
    HiveContextProvider.LOG.trace(
      'generateVerifiablePresentationFromUserMnemonics'
    );

    debugger;

    // the storePrivateKey method should probably go to loadDid method

    //----------------------

    try {
      const id = RootIdentity.getIdFromMnemonic(userMnemonic, password);
      let rootIdentityUser = this.store?.containsRootIdentity(id)
        ? await this.store?.loadRootIdentity(id)
        : RootIdentity.createFromMnemonic(
            userMnemonic,
            password,
            this.store as DIDStore,
            process.env.REACT_APP_APPLICATION_STORE_PASS as string
          );

      let userDid = rootIdentityUser.getDid(0);
      let userDoc = await DID.from(userDid)?.resolve(true);
      await this.store?.storeDid(userDoc as DIDDocument);

      let userDocument = (await this.store?.loadDid(userDid)) as DIDDocument;
      let doc = await this.getAppDocument();
      let didUrl: DIDURL = DIDURL.from(
        '#primary',
        userDocument.getSubject()
      ) as DIDURL;

      let issuerObject = new Issuer(userDocument, didUrl);
      //let vcBuilder = new VerifiableCredential.Builder(issuerObject, userDid);
      let vcBuilder = new VerifiableCredential.Builder(
        issuerObject,
        doc.getSubject()
      );

      let vc = await vcBuilder
        .expirationDate(this.getExpirationDate())
        .type('AppIdCredential')
        .property('appDid', doc.getSubject().toString())
        .property('appInstanceDid', doc.getSubject().toString())
        .id(
          DIDURL.from(
            '#app-id-credential',
            doc.getSubject().toString()
          ) as DIDURL
        )
        .seal(process.env.REACT_APP_APPLICATION_STORE_PASS as string); // and we sign so it creates a Proof with method and signature

      this.store?.storeCredential(vc);

      let vpb = await VerifiablePresentation.createFor(
        doc.getSubject(),
        null,
        this.store as DIDStore
      );
      let vp = await vpb
        .realm(issuer)
        .nonce(nonce)
        .credentials(vc)
        .seal(process.env.REACT_APP_APPLICATION_STORE_PASS as string);

      console.log('vp: ' + vp.toString(true));
      return vp;
    } catch (e) {
      HiveContextProvider.LOG.debug('Error generating presentation {}', e);
    }
  }

  // Copied from did.service.new.ts
  private async generateVerifiablePresentationFromEssentialCred(
    issuer: string,
    nonce: string
  ): Promise<any> {
    HiveContextProvider.LOG.trace(
      'generateVerifiablePresentationFromEssentialCred'
    );
    let didService = await DidService.getInstance();
    let appMnemonic = process.env.REACT_APP_APPLICATION_MNEMONICS as string;
    let appDidInstance = await didService.loadDid(appMnemonic);

    let didAccess = new CNDID.DIDAccess();
    let vc: VerifiableCredential = await didAccess.generateAppIdCredential();

    this.store!.storeCredential(vc);

    // store private key
    let id: DIDURL = DIDURL.from('#primary', appDidInstance) as DIDURL;
    didService.storePrivatekey(id, appMnemonic, '', 0);
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

  private async getAppDocument(): Promise<DIDDocument> {
    HiveContextProvider.LOG.trace('getAppDocument');

    if (this.contextParameters.userMnemonics === '') {
      let didAccess = new CNDID.DIDAccess();
      await didAccess.getOrCreateAppInstanceDID();

      let response = await didAccess.getExistingAppInstanceDIDInfo();
      let didStore = await DIDStore.open(response.storeId);

      let document = await didStore.loadDid(response.didString);

      return document;
    } else {
      return await this.store!.loadDid(this.contextParameters.appDID);
      //let did1 = await this.store!.loadDid(this.contextParameters.appDID);
      //HiveContextProvider.testStore = await DIDStore.open("test");
      // let store =       HiveContextProvider.testStore;
      // let did2 = await store.loadDid(this.contextParameters.appDID);

      // let didtest: DID | null;
      // if (did2 == null) {

      //   const id = RootIdentity.getIdFromMnemonic(this.contextParameters.appMnemonics, this.contextParameters.appPhrasePass);
      //   let rootIdentityTest = store.containsRootIdentity(id) ?
      //     await store.loadRootIdentity(id) :
      //     RootIdentity.createFromMnemonic(this.contextParameters.appMnemonics, this.contextParameters.appPhrasePass, store, "test");

      //   const synced = await rootIdentityTest.synchronizeIndex(0);
      //   //DIDEntity.LOG.info(`${this.name}: identity synchronized result: ${synced}`);
      //   didtest = rootIdentityTest.getDid(0);
      //   let docTest = await didtest.resolve(true);
      //   await store.storeDid(docTest as DIDDocument);

      //   return await store.loadDid(didtest);

      //   // debugger;
      //   // let doc = await DID.from(this.contextParameters.appDID)?.resolve(true) as DIDDocument;
      //   // await store.storeDid(docTest);
      // }
      //   debugger;
      //   return await store.loadDid(DID.from("") as DID);
      //let did3 = await store.loadDid(didD);
      //return did3;
    }
  }

  private async createToken(
    vp: VerifiablePresentation,
    hiveDid: string
  ): Promise<string> {
    HiveContextProvider.LOG.trace('createToken');
    let cal = dayjs();
    let iat = cal.unix();
    let nbf = cal.unix();
    let exp = cal.add(3, 'month').unix();

    let storePassword: string | undefined = undefined;
    if (this.contextParameters.userMnemonics === '') {
      // Create JWT token with presentation.
      let didAccess = new CNDID.DIDAccess();
      let response = await didAccess.getExistingAppInstanceDIDInfo();
      storePassword = response.storePassword;
    } else {
      storePassword = this.contextParameters.appStorePass;
    }

    let doc: DIDDocument = await this.getAppDocument();
    let token = await doc
      .jwtBuilder()
      .addHeader(JWTHeader.TYPE, JWTHeader.JWT_TYPE)
      .addHeader('version', '1.0')
      .addHeader(JWTHeader.CONTENT_TYPE, 'json')
      .setSubject('DIDAuthResponse')
      .setAudience(hiveDid)
      .setIssuedAt(iat)
      .setExpiration(exp)
      .setNotBefore(nbf)
      .claimsWithJson('presentation', vp.toString(true))
      .sign(storePassword);

    return token;
  }

  public getAppDid(): DID | null {
    HiveContextProvider.LOG.trace('getAppDid');
    return DID.from(this.contextParameters.appDID);
  }
}
