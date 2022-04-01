import Web3 from 'web3';
import { DidService } from 'src/services/did.service.new';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { DID, DIDDocument, DIDURL } from '@elastosfoundation/did-js-sdk/';
import { EssentialsService } from 'src/services/essentials.service';
import { connectivity } from '@elastosfoundation/elastos-connectivity-sdk-js';
import { signWithMetamask } from '../../../utils/web3';
import { requestRandomNonce, verifySignature } from './fetchapi';

export const verifyWalletOwner = async (web3: Web3, address: string) => {
  const nonceStatus: any = await requestRandomNonce(address);
  const signature = await signWithMetamask(address, web3, {
    domain: 'Profile',
    nonce: nonceStatus?.data || ''
  });
  const verifyStatus: any = await verifySignature(
    address,
    signature,
    'Profile'
  );
  return verifyStatus;
};

export const addWalletToDIDDocument = async (
  address: string,
  key: string,
  user: ISessionItem
) => {
  let didService = await DidService.getInstance();
  let newVC = await DidcredsService.generateVerifiableCredential(
    user.did,
    key,
    address
  );
  let didDocument = await removeWalletFromDIDDocument(key, user);
  if (user.isEssentialUser) {
    let essentialsService = new EssentialsService(didService);
    await essentialsService.addVerifiableCredentialEssentials(newVC);

    didDocument = await didService.getPublishedDocument(new DID(user.did));
  } else {
    didDocument = await didService.addVerifiableCredentialToDIDDocument(
      didDocument,
      newVC
    );
  }
  await DidcredsService.addOrUpdateCredentialToVault(user, newVC);
  await didService.storeDocument(didDocument);
  await didService.publishDocument(didDocument);
  return didDocument;
};
export const removeWalletFromDIDDocument = async (
  key: string,
  user: ISessionItem
) => {
  let didService = await DidService.getInstance();
  let didDocument: DIDDocument = await didService.getStoredDocument(
    new DID(user.did)
  );
  const oldVC = didDocument.getCredential(key);
  if (oldVC) {
    let vcKey = didDocument.getSubject().toString() + '#' + key;
    if (user.isEssentialUser) {
      let cn = connectivity.getActiveConnector();

      await cn?.deleteCredentials([vcKey], {
        forceToPublishCredentials: true
      });

      didDocument = await didService.getPublishedDocument(
        didDocument.getSubject()
      );
    } else {
      let builder = DIDDocument.Builder.newFromDocument(didDocument);
      builder = builder.removeCredential(key);
      didDocument = await builder.seal(
        process.env.REACT_APP_DID_STORE_PASSWORD as string
      );
    }
    await DidcredsService.removeCredentialToVault(user, vcKey);
    await didService.storeDocument(didDocument);
    await didService.publishDocument(didDocument);
  }
  return didDocument;
};
