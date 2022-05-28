import { TuumTechScriptService } from 'src/services/script.service';
import { CredentialType } from 'src/services/didcreds.service';

export const getOwners = async (assets: any[], network: string) => {
  const key = (network.toLowerCase() === 'elastos smart contract chain'
    ? CredentialType.ESCAddress
    : CredentialType.ETHAddress
  ).toLowerCase();
  const users = await TuumTechScriptService.getAllUsers();
  const filteredUsers = users.filter((user: any) => user.did.startsWith('did:'));
  const owners = assets.map((asset: any) => {
    const { owner } = asset;
    const user: any = filteredUsers
      .find((user: any) => user.wallets[key] === owner);
    return user || owner;
  });
  return owners;
};
