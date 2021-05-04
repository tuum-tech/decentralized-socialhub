import { DidDocumentService } from 'src/services/diddocument.service';
import { UserService } from 'src/services/user.service';

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

export const getDidDocument = async () => {
  let userSession = UserService.GetUserSession();
  if (!userSession) {
    return;
  }
  let documentState = await DidDocumentService.getUserDocument(userSession);
  return documentState.diddocument;
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
  });

  vcs = vcs.filter(item => {
    return item !== undefined;
  });

  if (vcs && vcs.length > 0) return vcs[0];

  return;
};
