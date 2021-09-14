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

    await cn?.importCredentials([vc], {
      forceToPublishCredentials: true
    });

    let document = await this.DidService.getDidDocument(
      vc.getId().getDid(),
      false
    );

    await this.DidService.storeDocument(document);

    this.DidService.Store.synchronize();
  };
}
