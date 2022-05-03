import {
  DID,
  DIDDocument,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import { Guid } from 'guid-typescript';

import { AssistService } from './assist.service';

import { DidService } from './did.service.new';
import { DidcredsService } from './didcreds.service';
import { EssentialsService } from './essentials.service';
import { ProfileService } from './profile.service';
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
    'Github',
    'Phone',
    'ETHAddress',
    'ESCAddress',
    'EIDAddress'
  ];

  private static async GetVerifiableCredentialsFromVault(
    sessionItem: ISessionItem
  ): Promise<Map<string, VerifiableCredential>> {
    return DidcredsService.getAllCredentialsToVault(sessionItem);
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

      if (field.toLowerCase() === 'avatar') {
        //TODO: To remove when new hive sdk can get avatar element
        if (sessionItem.isEssentialUser === true) return;
        //-----------------------------------

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

    let multipleTypes = ['Education', 'Experience'];

    multipleTypes.forEach(vcType => {
      let differences = this.GetDifferencesFromMultipleIds(
        vaultVcs,
        documentVcs,
        vcType
      );

      if (differences.length > 0) response.push(...differences);
    });

    return response;
  }

  private static GetDifferencesFromMultipleIds(
    vaultVcs: Map<string, VerifiableCredential>,
    documentVcs: Map<string, VerifiableCredential>,
    vcType: string
  ): Array<ISyncItem> {
    let response = new Array<ISyncItem>();

    vaultVcs.forEach((vaultVc, key) => {
      let fragment = vcType.toLowerCase();
      if (
        !vaultVc
          .getId()
          .getFragment()
          .startsWith(fragment)
      )
        return;

      let syncItem: ISyncItem = {
        Label: vcType,
        State: SyncState.Waiting,
        BlockchainCredential: documentVcs.has(key)
          ? documentVcs.get(key)
          : undefined,
        VaultCredential: vaultVc
      };

      if (
        documentVcs.has(key) &&
        this.IsVcEqual(vaultVc, documentVcs.get(key)!)
      )
        return;

      response.push(syncItem);
    });

    documentVcs.forEach((docVc, key) => {
      if (
        !docVc
          .getId()
          .getFragment()
          .startsWith(vcType.toLowerCase())
      )
        return;
      if (vaultVcs.has(key)) return;

      let syncItem: ISyncItem = {
        Label: vcType,
        State: SyncState.Waiting,
        BlockchainCredential: documentVcs.get(key),
        VaultCredential: undefined
      };
      response.push(syncItem);
    });

    return response;
  }

  private static IsVcEqual(
    vc1: VerifiableCredential | undefined,
    vc2: VerifiableCredential | undefined
  ): boolean {
    if (vc1 === undefined && vc2 === undefined) return true;
    if (vc1 === undefined && vc2 !== undefined) return false;
    if (vc1 !== undefined && vc2 === undefined) return false;

    return vc1?.getProof().getSignature() === vc2?.getProof().getSignature();
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
    if (sessionItem.isEssentialUser) {
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
      await didService.storeDocument(updatedDidDocument);
    } else {
      updatedDidDocument = await didService.updateMultipleVerifiableCredentialsToDIDDocument(
        didDocument,
        vcs,
        toRemoveFromBlockchain
      );
      await didService.storeDocument(updatedDidDocument);
      await didService.publishDocument(updatedDidDocument);
    }
  }

  private static async UpdateVault(
    sessionItem: ISessionItem,
    differences: Array<ISyncItem>
  ): Promise<ISessionItem> {
    if (differences.length <= 0) return sessionItem;

    var newSessionItem = { ...sessionItem };

    differences.forEach(async item => {
      if (item.BlockchainCredential === undefined) {
        await DidcredsService.removeCredentialToVault(
          sessionItem,
          item.VaultCredential!.getId().toString()
        );

        if (newSessionItem.loginCred === undefined)
          newSessionItem.loginCred = {};

        switch (item.Label.toLowerCase()) {
          case 'email':
            newSessionItem.email = '';
            newSessionItem.loginCred!.email = '';
            break;

          case 'linkedin':
            newSessionItem.loginCred!.linkedin = '';
            break;

          case 'twitter':
            newSessionItem.loginCred!.twitter = '';
            break;
          case 'facebook':
            newSessionItem.loginCred!.facebook = '';
            break;
          case 'github':
            newSessionItem.loginCred!.github = '';
            break;
          case 'discord':
            newSessionItem.loginCred!.discord = '';
            break;

          case 'phone':
            newSessionItem.loginCred!.phone = '';
            break;

          case 'education':
            let subjectEducationExc = item.VaultCredential?.getSubject().getProperty(
              item.VaultCredential.getId()
                .getFragment()
                .toLowerCase()
            );
            let educationItemExc: EducationItem = {
              end:
                subjectEducationExc['end'] === undefined
                  ? ''
                  : subjectEducationExc['end'],
              institution: subjectEducationExc['institution'],
              start: subjectEducationExc['start'],
              still: subjectEducationExc['end'] === undefined,
              program: subjectEducationExc['program'],
              guid: Guid.create(),
              isEmpty: false,
              title: '',
              description: '',
              order: '',
              verifiers: []
            };

            await ProfileService.removeEducationItem(
              educationItemExc,
              sessionItem
            );
            break;
          case 'experience':
            let subjectExperienceExc = item.VaultCredential?.getSubject().getProperty(
              item.VaultCredential.getId()
                .getFragment()
                .toLowerCase()
            );
            let experienceItemExc: ExperienceItem = {
              end:
                subjectExperienceExc['end'] === undefined
                  ? ''
                  : subjectExperienceExc['end'],
              institution:
                subjectExperienceExc['institution'] === undefined
                  ? ''
                  : subjectExperienceExc['institution'],
              start: subjectExperienceExc['start'],
              still: subjectExperienceExc['end'] === undefined,
              program: subjectExperienceExc['program'],
              guid: Guid.create(),
              isEmpty: false,
              title:
                subjectExperienceExc['title'] === undefined
                  ? ''
                  : subjectExperienceExc['title'],
              description:
                subjectExperienceExc['description'] === undefined
                  ? ''
                  : subjectExperienceExc['description'],
              order:
                subjectExperienceExc['order'] === undefined
                  ? ''
                  : subjectExperienceExc['order'],
              verifiers: [],
              isEnabled: true
            };

            await ProfileService.removeEducationItem(
              experienceItemExc,
              sessionItem
            );
            break;
          case 'avatar':
            newSessionItem.avatar = '';
            break;
          default:
            break;
        }
      } else {
        await DidcredsService.addOrUpdateCredentialToVault(
          sessionItem,
          item.BlockchainCredential!
        );

        let value = this.getValue(item);

        if (newSessionItem.loginCred === undefined)
          newSessionItem.loginCred = {};

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

          case 'phone':
            newSessionItem.loginCred!.phone = value;
            break;

          case 'education':
            let subjectEducation = item.BlockchainCredential?.getSubject().getProperty(
              item.BlockchainCredential.getId()
                .getFragment()
                .toLowerCase()
            );
            let educationItem: EducationItem = {
              end:
                subjectEducation['end'] === undefined
                  ? ''
                  : subjectEducation['end'],
              institution: subjectEducation['institution'],
              start: subjectEducation['start'],
              still: subjectEducation['end'] === undefined,
              program: subjectEducation['program'],
              guid: Guid.create(),
              isEmpty: false,
              title: '',
              description: '',
              order: '',
              verifiers: []
            };

            await ProfileService.updateEducationProfile(
              educationItem,
              sessionItem,
              false
            );
            break;
          case 'experience':
            let subjectExperience = item.BlockchainCredential?.getSubject().getProperty(
              item.BlockchainCredential.getId()
                .getFragment()
                .toLowerCase()
            );
            let experienceItem: ExperienceItem = {
              end:
                subjectExperience['end'] === undefined
                  ? ''
                  : subjectExperience['end'],
              institution:
                subjectExperience['institution'] === undefined
                  ? ''
                  : subjectExperience['institution'],
              start: subjectExperience['start'],
              still: subjectExperience['end'] === undefined,
              program: subjectExperience['program'],
              guid: Guid.create(),
              isEmpty: false,
              title:
                subjectExperience['title'] === undefined
                  ? ''
                  : subjectExperience['title'],
              description:
                subjectExperience['description'] === undefined
                  ? ''
                  : subjectExperience['description'],
              order:
                subjectExperience['order'] === undefined
                  ? ''
                  : subjectExperience['order'],
              verifiers: [],
              isEnabled: true
            };
            await ProfileService.updateExperienceProfile(
              experienceItem,
              sessionItem,
              false
            );

            await DidcredsService.addOrUpdateCredentialToVault(
              sessionItem,
              item.BlockchainCredential!
            );
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
      }
    });

    let userService = new UserService(await DidService.getInstance());
    return await userService.updateSession(newSessionItem, true);
  }
}
