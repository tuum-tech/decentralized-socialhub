import Web3 from 'web3';
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
