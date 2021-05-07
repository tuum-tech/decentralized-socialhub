import { DidcredsService, CredentialType } from 'src/services/didcreds.service';

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

export const getVerifiedCredential = (
  id: string,
  didDocument: any
): VerifiedCredential | undefined => {
  if (
    !didDocument ||
    !didDocument['id'] ||
    !didDocument['verifiableCredential']
  )
    return;
  let vcs: any[] = didDocument['verifiableCredential'].map((vc: any) => {
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
    return item !== undefined;
  });
  if (vcs && vcs.length > 0) return vcs[0];
  return;
};

export interface DidDocWithSessionSocial {
  hasSocial: boolean;
  doc: any;
}

export const checkLoginCredFromSession = async (
  sessionItem: ISessionItem,
  document: any
): Promise<DidDocWithSessionSocial> => {
  const { loginCred } = sessionItem;
  if (loginCred) {
    const vcs = [];
    if (loginCred.google) {
      let vc = await DidcredsService.generateVerifiableCredential(
        sessionItem.did,
        CredentialType.Google,
        loginCred.google
      );
      vcs.push(vc);
    }
    if (loginCred.facebook) {
      let vc = await DidcredsService.generateVerifiableCredential(
        sessionItem.did,
        CredentialType.Facebook,
        loginCred.facebook
      );
      vcs.push(vc);
    }
    if (loginCred.twitter) {
      let vc = await DidcredsService.generateVerifiableCredential(
        sessionItem.did,
        CredentialType.Twitter,
        loginCred.twitter
      );
      vcs.push(vc);
    }
    if (loginCred.linkedin) {
      let vc = await DidcredsService.generateVerifiableCredential(
        sessionItem.did,
        CredentialType.Linkedin,
        loginCred.linkedin
      );
      vcs.push(vc);
    }
    return {
      hasSocial: vcs.length > 0,
      doc: {
        ...document,
        verifiableCredential: vcs
      }
    };
  }
  return {
    hasSocial: false,
    doc: document
  };
};

export const hasCredentials = (diddocument: any) => {
  let has = false;
  if (
    diddocument &&
    diddocument.verifiableCredential &&
    diddocument.verifiableCredential.length > 0
  ) {
    for (let i = 0; i < diddocument.verifiableCredential.length; i++) {
      if (diddocument.verifiableCredential[i].credentialSubject) {
        const { credentialSubject } = diddocument.verifiableCredential[i];
        if (
          credentialSubject.google ||
          credentialSubject.linkedin ||
          credentialSubject.twitter ||
          credentialSubject.facebook
        ) {
          has = true;
        }
      }
    }
  }
  return has;
};
