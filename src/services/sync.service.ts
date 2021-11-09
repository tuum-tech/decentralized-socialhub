import {
  DID,
  DIDDocument,
  JSONObject,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import session from 'redux-persist/lib/storage/session';
import { AssistService } from './assist.service';

import { DidService } from './did.service.new';
import { DidcredsService } from './didcreds.service';
import { DidDocumentService } from './diddocument.service';
import { EssentialsService } from './essentials.service';
import { HiveService } from './hive.service';
import { TuumTechScriptService } from './script.service';
import { UserService } from './user.service';

export enum SyncState {
  Waiting = 0,
  Vault = 1,
  Blockchain = 2
}

export interface ISyncItem {
  Label: string;
  VaultCredential: VerifiableCredential | undefined;
  BlockchainCredential: VerifiableCredential | undefined;
  State: SyncState;
}

export class SyncService {
  static fields = [
    'Name',
    'Email',
    'Avatar',
    'Google',
    'Facebook',
    'Twitter',
    'Linkedin',
    'Discord',
    'Github'
  ];

  private static async GetVerifiableCredentialsFromVault(
    sessionItem: ISessionItem
  ): Promise<Map<string, VerifiableCredential>> {
    let hiveClient = await HiveService.getSessionInstance(sessionItem);
    let hiveResponse = await hiveClient?.Scripting.RunScript<any>({
      name: 'get_verifiable_credentials'
    });

    let response = new Map<string, VerifiableCredential>();

    if (!hiveResponse?.isSuccess) return response;

    var collection = hiveResponse.response.get_verifiable_credentials.items;

    collection.forEach((item: { vc: string | JSONObject }) => {
      var vc = VerifiableCredential.parse(item.vc);
      response.set(vc.getId().toString(), vc);
    });

    return response;
  }

  private static async GetVerifiableCredentialsFromRecentDocument(
    sessionItem: ISessionItem
  ): Promise<Map<string, VerifiableCredential>> {
    let didService = await DidService.getInstance();
    let recentDocument = await didService.getPublishedDocument(
      new DID(sessionItem.did)
    );

    let response = new Map<string, VerifiableCredential>();

    recentDocument.credentials!.forEach(vc => {
      response.set(vc.getId().toString(), vc);
    });

    return response;
  }

  static async HasDifferences(sessionItem: ISessionItem): Promise<boolean> {
    if (
      !sessionItem ||
      !sessionItem.onBoardingCompleted ||
      !sessionItem.tutorialStep ||
      sessionItem.tutorialStep < 4
    )
      return false;

    let publishingStatus = AssistService.getPublishStatusTask(sessionItem.did);

    if (publishingStatus !== undefined) return false;

    let differences = await this.GetSyncDifferences(sessionItem);
    return differences.length > 0;
  }

  static async TempInitializeSignedUsers(sessionItem: ISessionItem) {
    if (
      !sessionItem ||
      !sessionItem.onBoardingCompleted ||
      !sessionItem.tutorialStep ||
      sessionItem.tutorialStep < 4
    )
      return;

    let vaultVcs = await this.GetVerifiableCredentialsFromVault(sessionItem);

    if (vaultVcs.has(sessionItem.did + '#name')) return;

    let documentVcs = await this.GetVerifiableCredentialsFromRecentDocument(
      sessionItem
    );

    let didService = await DidService.getInstance();
    let recentDocument = await didService.getStoredDocument(
      new DID(sessionItem.did)
    );

    recentDocument.credentials?.forEach(async item => {
      await DidcredsService.addOrUpdateCredentialToVault(sessionItem, item);
    });
  }

  static async GetSyncDifferences(
    sessionItem: ISessionItem
  ): Promise<Array<ISyncItem>> {
    let vaultVcs = await this.GetVerifiableCredentialsFromVault(sessionItem);
    let documentVcs = await this.GetVerifiableCredentialsFromRecentDocument(
      sessionItem
    );
    let response = new Array<ISyncItem>();

    this.fields.forEach(field => {
      let key = sessionItem.did + '#' + field.toLowerCase();
      var syncItem: ISyncItem = {
        Label: field,
        State: SyncState.Waiting,
        BlockchainCredential: documentVcs.has(key)
          ? documentVcs.get(key)
          : undefined,
        VaultCredential: vaultVcs.has(key) ? vaultVcs.get(key) : undefined
      };

      if (
        (syncItem.BlockchainCredential === undefined &&
          syncItem.VaultCredential === undefined) ||
        (syncItem.BlockchainCredential !== undefined &&
          syncItem.VaultCredential !== undefined &&
          syncItem.BlockchainCredential.getSubject().getProperties()[
            field.toLowerCase()
          ] ===
            syncItem.VaultCredential.getSubject().getProperties()[
              field.toLowerCase()
            ])
      )
        return;

      if (
        (syncItem.BlockchainCredential === undefined &&
          syncItem.VaultCredential !== undefined) ||
        (syncItem.BlockchainCredential !== undefined &&
          syncItem.VaultCredential === undefined)
      ) {
        if (syncItem.BlockchainCredential == undefined)
          syncItem.State = SyncState.Vault;
      }

      if (field.toLowerCase() === 'avatar') {
        let imgVault = '';
        let imgBlockchain = '';

        if (syncItem.VaultCredential)
          imgVault = syncItem.VaultCredential.getSubject().getProperty(
            'avatar'
          )['data'];
        if (syncItem.BlockchainCredential)
          imgBlockchain = syncItem.BlockchainCredential.getSubject().getProperty(
            'avatar'
          )['data'];

        if (imgVault === imgBlockchain) return;
      }

      response.push(syncItem);
    });

    return response;
  }

  static getValue(syncItem: ISyncItem) {
    let vc =
      syncItem.State === SyncState.Vault
        ? syncItem.VaultCredential!
        : syncItem.BlockchainCredential!;

    let fragment = vc.getId().getFragment();
    return vc.getSubject().getProperty(fragment);
  }

  static async UpdateDifferences(
    sessionItem: ISessionItem,
    differences: Array<ISyncItem>
  ): Promise<ISessionItem> {
    let toVault = differences.filter(
      s =>
        s.State === SyncState.Blockchain && s.BlockchainCredential !== undefined
    );
    let toBlockchain = differences.filter(s => s.State === SyncState.Vault);

    await this.UpdateDidDocument(sessionItem, toBlockchain);
    sessionItem = await this.UpdateVault(sessionItem, toVault);

    return sessionItem;
  }

  private static async UpdateDidDocument(
    sessionItem: ISessionItem,
    differences: Array<ISyncItem>
  ): Promise<void> {
    if (differences.length <= 0) return;

    let vcs = differences
      .filter(value => value.VaultCredential !== undefined)
      .map(value => value.VaultCredential!);

    let toRemoveFromBlockchain = differences
      .filter(
        value =>
          value.BlockchainCredential !== undefined &&
          value.VaultCredential === undefined
      )
      .map(m => m.BlockchainCredential!.getId().toString());

    let didService = await DidService.getInstance();
    let did = new DID(sessionItem.did);
    let didDocument: DIDDocument = await didService.getPublishedDocument(did);
    await didService.Store.storeDid(didDocument);

    let updatedDidDocument: DIDDocument;
    if (sessionItem.mnemonics === '') {
      let essentialsService = new EssentialsService(didService);
      let isAdded = await essentialsService.addMultipleVerifiableCredentialsToEssentials(
        vcs
      );

      if (!isAdded) {
        window.close();
        return;
      }

      if (toRemoveFromBlockchain.length > 0) {
        let isRemoved = await essentialsService.removeMultipleVerifiableCredentialsToEssentials(
          toRemoveFromBlockchain
        );

        if (!isRemoved) {
          window.close();
          return;
        }
      }

      updatedDidDocument = await didService.getPublishedDocument(
        new DID(sessionItem.did)
      );
    } else {
      updatedDidDocument = await didService.updateMultipleVerifiableCredentialsToDIDDocument(
        didDocument,
        vcs,
        toRemoveFromBlockchain
      );
    }

    await didService.storeDocument(updatedDidDocument);
    await didService.publishDocument(updatedDidDocument);
  }

  private static async UpdateVault(
    sessionItem: ISessionItem,
    differences: Array<ISyncItem>
  ): Promise<ISessionItem> {
    if (differences.length <= 0) return sessionItem;

    var newSessionItem = { ...sessionItem };

    differences.forEach(async item => {
      await DidcredsService.addOrUpdateCredentialToVault(
        sessionItem,
        item.BlockchainCredential!
      );
      let value = this.getValue(item);

      if (newSessionItem.loginCred == undefined) newSessionItem.loginCred = {};

      switch (item.Label.toLowerCase()) {
        case 'name':
          newSessionItem.name = value;
          break;

        case 'email':
          newSessionItem.email = value;
          newSessionItem.loginCred!.email = value;
          break;

        case 'linkedin':
          newSessionItem.loginCred!.linkedin = value;
          break;

        case 'twitter':
          newSessionItem.loginCred!.twitter = value;
          break;
        case 'facebook':
          newSessionItem.loginCred!.facebook = value;
          break;
        case 'github':
          newSessionItem.loginCred!.github = value;
          break;
        case 'discord':
          newSessionItem.loginCred!.discord = value;
          break;

        case 'avatar':
          let atavarValue = item
            .BlockchainCredential!.getSubject()
            .getProperties()['avatar'];
          let avatarObject = JSON.parse(JSON.stringify(atavarValue));
          let baseStr = avatarObject['data'];
          newSessionItem.avatar = `data:${avatarObject['content-type']};base64,${baseStr}`;
          break;
        default:
          break;
      }
    });

    let userService = new UserService(await DidService.getInstance());
    return await userService.updateSession(newSessionItem, true);
  }
}
