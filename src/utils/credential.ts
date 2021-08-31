import { DIDDocument } from '@elastosfoundation/did-js-sdk/typings';
import { DidDocumentService } from 'src/services/diddocument.service';

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

export const getDidDocument = async (
  userSession: ISessionItem
): Promise<DIDDocument> => {
  return await DidDocumentService.getUserDocument(userSession);
};

export const containsVerifiedCredential = (
  id: string,
  diddocument: any
): boolean => {
  return getVerifiedCredential(id, diddocument) !== undefined;
};

export const getVerifiedCredential = (
  id: string,
  diddocument: any
): VerifiedCredential | undefined => {
  if (
    !diddocument ||
    !diddocument['id'] ||
    !diddocument['verifiableCredential']
  )
    return;

  let vcs: any[] = diddocument['verifiableCredential'].map((vc: any) => {
    if (`${vc['id']}`.endsWith(`#${id.toLowerCase()}`)) {
      let types: string[] = vc['type'];

      return {
        value: vc['credentialSubject'][id.toLowerCase()],
        isVerified: !types.includes('SelfProclaimedCredential')
      };
    }
    return null;
  });

  vcs = vcs.filter(item => {
    return item !== undefined && item !== null;
  });

  if (vcs && vcs.length > 0) return vcs[0];

  return;
};
