import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { TuumTechScriptService } from 'src/services/script.service';
import { DidcredsService } from 'src/services/didcreds.service';
import { DidDocumentService } from 'src/services/diddocument.service';
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
        const creds = await DidcredsService.getAllCredentialsToVault(user);
        const id = `${user.did}#${key}`;
        const vc = creds.get(id);
        return {
          session: user,
          wallet_address: vc
            ? vc.getIssuer().toString() ===
              process.env.REACT_APP_APPLICATION_DID
              ? vc.subject.getProperty(key)
              : ''
            : ''
        };
      })
  );
  const owners = assets.map((asset: any) => {
    const { owner } = asset;
    const user: any = usersWithCred.find(
      (user: any) => user.wallet_address === owner
    );
    if (user) return user.session;
    return owner;
  });
  return owners;
};
