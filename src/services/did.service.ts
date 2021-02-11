import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';
// import { DidcredsService } from './didcreds.service';
// import { AccountType } from './user.service';

export interface IDID {
  mnemonic: string;
  privateKey: string;
  publicKey: string;
  did: string;
}

export class DidService {
  static async loadDid(mnemonic: string, password: string = ''): Promise<IDID> {
    return await ElastosClient.did.loadFromMnemonic(mnemonic, password);
  }

  static async generateNew(): Promise<IDID> {
    return await ElastosClient.did.generateNew();
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

  static async temporaryDidDocument(did: IDID): Promise<any> {
    //TEMPORARY: The real method will get the document fom blockchain or cache
    let document = ElastosClient.didDocuments.newDIDDocument(did);
    return document;
  }

  static sealDIDDocument(did: IDID, diddocument: any) {
    ElastosClient.didDocuments.sealDocument(did, document);
    return document;
  }

  static async addVerfiableCredentialToDIDDocument(diddocument: any, vc: any) {
    ElastosClient.didDocuments.addVerfiableCredentialToDIDDocument(
      diddocument,
      vc
    );
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

  static async generatePublishRequest(diddocument: any): Promise<any> {
    let appMnemonic = `${process.env.REACT_APP_APPLICATION_MNEMONICS}`;
    let appDid = await this.loadDid(appMnemonic);
    let isValid = false;
    let tx: any;
    while (!isValid) {
      tx = ElastosClient.idChainRequest.generateCreateRequest(
        diddocument,
        appDid
      );
      isValid = ElastosClient.idChainRequest.isValid(tx, appDid);
    }

    return tx;
  }
}
