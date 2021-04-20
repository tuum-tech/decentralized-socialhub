import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import { UserService } from 'src/services/user.service';

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

export const loginCredSyn = async (
  userSssion: ISessionItem,
  diddocument: any
) => {
  const { loginCred } = userSssion;

  const doc_linkedin = getVerifiedCredential('linkedin', diddocument);
  const doc_twitter = getVerifiedCredential('twitter', diddocument);
  const doc_facebook = getVerifiedCredential('facebook', diddocument);
  const doc_google = getVerifiedCredential('google', diddocument);

  let newLoginCred = loginCred || {};
  let hasChanged = false;
  if (doc_linkedin && doc_linkedin.value) {
    if (
      !loginCred ||
      !loginCred.linkedin ||
      loginCred.linkedin !== doc_linkedin.value
    ) {
      newLoginCred.linkedin = doc_linkedin.value;
      hasChanged = true;
    }
  }
  if (doc_twitter && doc_twitter.value) {
    if (
      !loginCred ||
      !loginCred.twitter ||
      loginCred.twitter !== doc_twitter.value
    ) {
      newLoginCred.twitter = doc_twitter.value;
      hasChanged = true;
    }
  }
  if (doc_google && doc_google.value) {
    if (
      !loginCred ||
      !loginCred.google ||
      loginCred.google !== doc_google.value
    ) {
      newLoginCred.google = doc_google.value;
      hasChanged = true;
    }
  }
  if (doc_facebook && doc_facebook.value) {
    if (
      !loginCred ||
      !loginCred.facebook ||
      loginCred.facebook !== doc_facebook.value
    ) {
      newLoginCred.facebook = doc_facebook.value;
      hasChanged = true;
    }
  }
  if (hasChanged) {
    await UserService.updateSession({
      ...userSssion,
      loginCred: newLoginCred
    } as ISessionItem);
  }
};
