import { TuumTechScriptService } from 'src/services/script.service';
import { DidcredsService } from 'src/services/didcreds.service';
import { CredentialType } from 'src/services/didcreds.service';

export const getOwners = async (assets: any[], network: string) => {
  const key = (network.toLowerCase() === 'elastos smart contract chain'
    ? CredentialType.ESCAddress
    : CredentialType.ETHAddress
  ).toLowerCase();
  const users = await TuumTechScriptService.getAllUsers();
  const usersWithCred = await Promise.all(
    users
      .filter((user: any) => user.did.startsWith('did:'))
      .map(async (user: any) => {
        const wallet = await DidcredsService.getCredentialValue(user, key);
        return {
          session: user,
          wallet: wallet
        };
      })
  );
  console.log('tuum tech users: => ', usersWithCred);
  console.log(
    'collection members: => ',
    assets.map((asset: any) => asset.owner)
  );
  const owners = assets.map((asset: any) => {
    const { owner } = asset;
    const user: any = usersWithCred.find((user: any) => user.wallet === owner);
    if (user) return user.session;
    return owner;
  });
  return owners;
};
