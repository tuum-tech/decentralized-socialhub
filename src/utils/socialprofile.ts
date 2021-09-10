import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

export const getParsedDoc = async (document: string): Promise<DIDDocument> => {
  return await DIDDocument.parseContent(document);
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
    if (loginCred.github) {
      let vc = await DidcredsService.generateVerifiableCredential(
        sessionItem.did,
        CredentialType.Github,
        loginCred.github
      );
      vcs.push(vc);
    }
    if (loginCred.discord) {
      let vc = await DidcredsService.generateVerifiableCredential(
        sessionItem.did,
        CredentialType.Discord,
        loginCred.discord
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

const hasCredential = (document: DIDDocument, key: string): boolean => {
  if (
    document.selectCredentials(key.toLowerCase(), 'InternetAccountCredential')
      .length > 0
  )
    return true;

  return false;
};

export const hasCredentials = async (didDocument: DIDDocument) => {
  if (didDocument === null) return false;

  if (hasCredential(didDocument, 'google')) return true;
  if (hasCredential(didDocument, 'linkedin')) return true;
  if (hasCredential(didDocument, 'twitter')) return true;
  if (hasCredential(didDocument, 'facebook')) return true;
  if (hasCredential(didDocument, 'github')) return true;
  if (hasCredential(didDocument, 'discord')) return true;

  return false;
};
