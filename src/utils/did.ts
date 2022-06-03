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

export const getShortenedDid = (did: string, length: number) => {
  let sDid = did.replace('did:elastos:', '');
  if (sDid.length <= 2 * length) {
    return did;
  }
  sDid = `${sDid.substring(0, length)}...${sDid.substring(
    sDid.length - length
  )}`;

  return `did:elastos:${sDid}`;
};
