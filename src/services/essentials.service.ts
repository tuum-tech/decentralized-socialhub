import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/';
import {
  connectivity,
  DID as CnDID
} from '@elastosfoundation/elastos-connectivity-sdk-js';
import { DidService } from './did.service.new';

export class EssentialsService {
  private DidService: DidService;

  constructor(didService: DidService) {
    this.DidService = didService;
  }

  addVerifiableCredentialEssentials = async (
    vc: VerifiableCredential
  ): Promise<boolean> => {
    let cn = new CnDID.DIDAccess();
    let response = await cn?.importCredentials([vc], {
      forceToPublishCredentials: true
    });

    return response.length > 0;
  };
}
