import {
  DIDDocument,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/typings';
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

export const getCredentials = (id: string, diddocument: any): [] => {
  if (!diddocument || diddocument.getCredentialCount() === 0) return [];

  let vcs = diddocument.getCredentials().map((vc: any) => {
    const subject: VerifiableCredential.Subject = vc.getSubject();
    const subjectProperties = subject.getProperties();
    const key = Object.keys(subjectProperties)[0];
    const value = Object.values(subjectProperties)[0];
    if (
      key.toLocaleLowerCase().includes(id.toLocaleLowerCase()) &&
      value &&
      value !== ''
    ) {
      let verifier = value.toString().replace('Verified_By_', '');
      let nameAndDid = verifier.split('(');
      let name = nameAndDid[0];
      let did = nameAndDid[1].replace('(', '').replace(')', '');

      return {
        name,
        did
      };
    }
    return null;
  });

  vcs = vcs.filter((item: any) => {
    return item !== undefined && item !== null;
  });

  if (vcs && vcs.length > 0) return vcs;
  return [];
};
