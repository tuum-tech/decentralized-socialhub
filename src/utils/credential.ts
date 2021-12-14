// import { DIDDocument } from '@elastosfoundation/did-js-sdk/typings';
import { DidDocumentService } from 'src/services/diddocument.service';
import {
  VerifiableCredential,
  DIDDocument
} from '@elastosfoundation/did-js-sdk/';
export interface VCType {
  vc: VerifiableCredential;
  isValid: boolean;
  isVerified: boolean;
  id: string;
}

export const getDidDocument = async (
  userSession: ISessionItem
): Promise<DIDDocument> => {
  return await DidDocumentService.getUserDocument(userSession);
};

export const containingVerifiableCredentialDetails = async (
  id: string,
  diddocument: any
): Promise<VCType> => {
  if (!diddocument || diddocument.getCredentialCount() === 0) {
    return {
      id,
      vc: {} as VerifiableCredential,
      isVerified: false,
      isValid: false
    };
  }

  let vcIndex = -1;
  const vcs = diddocument.getCredentials();
  for (let i = 0; i < vcs.length; i++) {
    const subject: VerifiableCredential.Subject = vcs[i].getSubject();
    const subjectProperties = subject.getProperties();
    const key = Object.keys(subjectProperties)[0];

    //if (key.toLowerCase().startsWith("education")) console.log(subjectProperties)

    if (key.toLowerCase() === id.toLowerCase()) {
      vcIndex = i;
    } else if (key.toLowerCase().startsWith(id.toLowerCase())) {
      vcIndex = i;
    }
  }

  if (vcIndex === -1) {
    return {
      id,
      vc: {} as VerifiableCredential,
      isVerified: false,
      isValid: false
    };
  }

  const vc: VerifiableCredential = vcs[vcIndex];
  const isValid = await vc.isValid();
  return { id, vc, isVerified: vcIndex > -1, isValid };
};

export const getCategoryTitle = (vc: VerificationData) => {
  let cateogryTitle = vc.category;

  let formatedTitle = '';
  const strings = cateogryTitle.split('_');
  // for (let i = 0; i < strings.length; i++) {
  //   const word = strings[i];
  //   formatedTitle += word[0].toUpperCase() + word.slice(1) + ' ';
  // }
  const word = strings[0].replace(':', '');
  formatedTitle += word[0].toUpperCase() + word.slice(1) + ' ';
  return formatedTitle;
};
