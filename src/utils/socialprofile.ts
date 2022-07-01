import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

export const getParsedDoc = async (document: string): Promise<DIDDocument> => {
  return await DIDDocument.parseAsync(document);
};

export interface DidDocWithSessionSocial {
  hasSocial: boolean;
  doc: any;
}

const hasCredential = (document: DIDDocument, key: string): boolean => {
  if (
    document.selectCredentials(key.toLowerCase(), 'BasicProfileCredential')
      .length > 0
  )
    return true;

  return false;
};

export const hasCredentials = (didDocument: DIDDocument) => {
  if (didDocument === null) return false;

  if (hasCredential(didDocument, 'google')) return true;
  if (hasCredential(didDocument, 'facebook')) return true;
  if (hasCredential(didDocument, 'twitter')) return true;
  if (hasCredential(didDocument, 'linkedin')) return true;
  if (hasCredential(didDocument, 'github')) return true;
  if (hasCredential(didDocument, 'reddit')) return true;
  if (hasCredential(didDocument, 'discord')) return true;
  if (hasCredential(didDocument, 'twitch')) return true;
  if (hasCredential(didDocument, 'apple')) return true;
  if (hasCredential(didDocument, 'line')) return true;
  if (hasCredential(didDocument, 'kakao')) return true;
  if (hasCredential(didDocument, 'weibo')) return true;
  if (hasCredential(didDocument, 'wechat')) return true;

  return false;
};
