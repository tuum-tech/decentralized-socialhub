import { DidService } from 'src/services/did.service';

export type UserType = {
  did: string;
  mnemonic: string;
  name: string;
  hiveHost: string;
  loginCred: LoginCred;
};

export const retreiveDocInfo = async (
  did: string,
  mnemonic: string,
  name = '',
  email = ''
) => {
  let doc = await DidService.getDidDocument(did);
  let uInfo: UserType = {
    did,
    mnemonic,
    name: name,
    hiveHost: '',
    loginCred: {
      email: email
    }
  };
  if (doc && doc !== undefined && doc.verifiableCredential) {
    if (doc.verifiableCredential && doc.verifiableCredential.length > 0) {
      let loginCred: any = {};
      for (let i = 0; i < doc.verifiableCredential.length; i++) {
        const cv = doc.verifiableCredential[i];
        if (cv.credentialSubject && cv.credentialSubject.name) {
          uInfo.name = cv.credentialSubject.name;
        }
        if (cv.credentialSubject && cv.credentialSubject.email) {
          loginCred.email = cv.credentialSubject.email;
        }
        if (cv.credentialSubject && cv.credentialSubject.google) {
          loginCred.google = cv.credentialSubject.google;
        }
        if (cv.credentialSubject && cv.credentialSubject.twitter) {
          loginCred.twitter = cv.credentialSubject.twitter;
        }
        if (cv.credentialSubject && cv.credentialSubject.facebook) {
          loginCred.facebook = cv.credentialSubject.facebook;
        }
        if (cv.credentialSubject && cv.credentialSubject.linkedin) {
          loginCred.linkedin = cv.credentialSubject.linkedin;
        }
      }
      uInfo.loginCred = loginCred;
    }

    if (doc.service && doc.service.length > 0) {
      uInfo.hiveHost = doc.service[0].serviceEndpoint;
    }
  }
  return uInfo;
};
