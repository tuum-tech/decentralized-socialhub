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

    console.log('DID Published', recentDocument);

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

    // if (!AssistService.getPublishStatusTask(sessionItem.did)) return false;

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
    console.log('update did document', differences);
    if (differences.length <= 0) return;

    let vcs = differences.map(value => value.VaultCredential!);
    let toRemoveFromBlockchain = differences
      .filter(
        value =>
          value.BlockchainCredential !== undefined &&
          value.VaultCredential === undefined
      )
      .map(m => m.BlockchainCredential!.getId().toString());

    let didService = await DidService.getInstance();
    let didDocument: DIDDocument = await didService.getStoredDocument(
      new DID(sessionItem.did)
    );

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

    differences.forEach(async item => {
      await DidcredsService.addOrUpdateCredentialToVault(
        sessionItem,
        item.BlockchainCredential!
      );
      let value = this.getValue(item);

      if (sessionItem.loginCred == undefined) sessionItem.loginCred = {};

      switch (item.Label.toLowerCase()) {
        case 'name':
          sessionItem.name = value;
          break;

        case 'email':
          sessionItem.email = value;
          sessionItem.loginCred!.email = value;
          break;

        case 'linkedin':
          sessionItem.loginCred!.linkedin = value;
          break;

        case 'twitter':
          sessionItem.loginCred!.twitter = value;
          break;
        case 'facebook':
          sessionItem.loginCred!.facebook = value;
          break;
        case 'github':
          sessionItem.loginCred!.github = value;
          break;
        case 'discord':
          sessionItem.loginCred!.discord = value;
          break;

        case 'avatar':
          let atavarValue = item
            .BlockchainCredential!.getSubject()
            .getProperties()['avatar'];
          let avatarObject = JSON.parse(atavarValue.toString());
          let baseStr = avatarObject['data'];
          sessionItem.avatar = `data:${avatarObject['content-type']};base64,${baseStr}`;

          break;
        default:
          break;
      }
    });

    let userService = new UserService(await DidService.getInstance());
    return await userService.updateSession(sessionItem, true);
  }
}
