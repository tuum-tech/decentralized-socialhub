export const getDIDString = (did: string, isLink = true) => {
  if (did && did !== '') {
    if (isLink) {
      return did.replaceAll('did:elastos:', '');
    }
    if (did.startsWith('did:elastos:')) return did;
    return 'did:elastos:' + did;
  }
  return did;
};
