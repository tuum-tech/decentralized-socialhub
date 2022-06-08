import { TuumTechScriptService } from 'src/services/script.service';
import { CredentialType } from 'src/services/didcreds.service';

export const getOwners = async (addresses: any[], network: string) => {
  const key = (network.toLowerCase() === 'elastos smart contract chain'
    ? CredentialType.ESCAddress
    : CredentialType.ETHAddress
  ).toLowerCase();
  const owners = await Promise.all(
    addresses.map(async address => {
      const users = await TuumTechScriptService.searchUserWithWallet({
        type: key,
        address
      });
      return users.length > 0 ? users[0] : address;
    })
  );
  return owners;
};
