import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import { DID as CnDID } from '@elastosfoundation/elastos-connectivity-sdk-js';
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
    let cn = new CnDID.DIDAccess();
    let response = await cn?.importCredentials(vcs, {
      forceToPublishCredentials: true
    });

    return response.length > 0;
  };
}
