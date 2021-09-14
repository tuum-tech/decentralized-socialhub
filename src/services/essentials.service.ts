import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { DidService } from './did.service.new';

export class EssentialsService {
  private DidService: DidService;

  constructor(didService: DidService) {
    this.DidService = didService;
  }

  addVerifiableCredentialEssentials = async (vc: VerifiableCredential) => {
    let cn = connectivity.getActiveConnector();

    let response = await cn?.importCredentials([vc], {
      forceToPublishCredentials: true
    });

    if (response?.length! > 0) {
      this.DidService.Store.synchronize();
    }
  };
}
