import {
  DID,
  DIDDocument,
  JSONObject,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import session from 'redux-persist/lib/storage/session';

import { DidService } from './did.service.new';
import { DidcredsService } from './didcreds.service';
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
    let differences = await this.GetSyncDifferences(sessionItem);
    return differences.length > 0;
  }

  static async GetSyncDifferences(
    sessionItem: ISessionItem
  ): Promise<Array<ISyncItem>> {
    let fields = [
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
    let vaultVcs = await this.GetVerifiableCredentialsFromVault(sessionItem);
    let documentVcs = await this.GetVerifiableCredentialsFromRecentDocument(
      sessionItem
    );
    let response = new Array<ISyncItem>();

    fields.forEach(field => {
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
        syncItem.BlockchainCredential !== undefined &&
        syncItem.VaultCredential !== undefined &&
        syncItem.BlockchainCredential.getSubject().getProperties()[
          field.toLowerCase()
        ] !==
          syncItem.VaultCredential.getSubject().getProperties()[
            field.toLowerCase()
          ]
      )
        response.push(syncItem);

      if (
        (syncItem.BlockchainCredential === undefined &&
          syncItem.VaultCredential !== undefined) ||
        (syncItem.BlockchainCredential !== undefined &&
          syncItem.VaultCredential === undefined)
      )
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
    let toVault = differences.filter(s => s.State === SyncState.Blockchain);
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

    let vcs = differences.map(value => value.VaultCredential!);
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
      updatedDidDocument = await didService.getPublishedDocument(
        new DID(sessionItem.did)
      );
    } else {
      updatedDidDocument = await didService.addMultipleVerifiableCredentialsToDIDDocument(
        didDocument,
        vcs
      );
    }

    await didService.storeDocument(updatedDidDocument);
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
