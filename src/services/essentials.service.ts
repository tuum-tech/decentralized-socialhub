import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import { DID as ConnDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { DidService } from './did.service.new';

export class EssentialsService {
  private DidService: DidService;

  constructor(didService: DidService) {
    this.DidService = didService;
  }

  addVerifiableCredentialEssentials = async (
    vc: VerifiableCredential
  ): Promise<boolean> => {
    return this.addMultipleVerifiableCredentialsToEssentials([vc]);
  };

  addMultipleVerifiableCredentialsToEssentials = async (
    vcs: VerifiableCredential[]
  ): Promise<boolean> => {
    let didAccess = new ConnDID.DIDAccess();
    let response = await didAccess.importCredentials(vcs, {
      forceToPublishCredentials: true
    });

    if (response === null) return false;

    return response.length > 0;
  };

  removeMultipleVerifiableCredentialsToEssentials = async (
    vcs: string[]
  ): Promise<boolean> => {
    let didAccess = new ConnDID.DIDAccess();
    let response = await didAccess.deleteCredentials(vcs, {
      forceToPublishCredentials: true
    });
    return response.length > 0;
  };
}
