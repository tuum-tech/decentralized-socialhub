import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { TuumTechScriptService } from 'src/services/script.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { CredentialType } from 'src/services/didcreds.service';

export const getOwners = async (assets: any[], network: string) => {
  const users = await TuumTechScriptService.getAllUsers();
  const didDocuments: DIDDocument[] = await Promise.all(
    users
      .filter((user: any) => user.did.startsWith('did:'))
      .map(async (user: any) => {
        return await DidDocumentService.getUserDocumentByDid(user.did);
      })
  );
  const owners = assets.map((asset: any) => {
    const { owner } = asset;
    const document: DIDDocument | undefined = didDocuments.find(
      (document: DIDDocument) => {
        const verifyAddress = (key: string) => {
          const vc = document.getCredential(key.toLowerCase());
          if (!vc) return false;
          const address = vc.subject.getProperty(key.toLowerCase());
          return address === owner;
        };
        return verifyAddress(
          network.toLowerCase() === 'ethereum'
            ? CredentialType.ETHAddress
            : CredentialType.ESCAddress
        );
      }
    );
    if (!document) return owner;
    const did = document.getSubject().toString();
    const user = users.find((user: any) => user.did === did);
    return user;
  });
  return owners;
};
