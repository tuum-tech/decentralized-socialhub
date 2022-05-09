import Web3 from 'web3';
import { DidService } from 'src/services/did.service.new';
import { DidcredsService } from 'src/services/didcreds.service';
import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { EssentialsService } from 'src/services/essentials.service';
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
