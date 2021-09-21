import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/typings';

export const getCredentials = (id: string, diddocument: any): [] => {
  if (!diddocument || diddocument.getCredentialCount() === 0) return [];

  let vcs = diddocument.getCredentials().map((vc: any) => {
    const subject: VerifiableCredential.Subject = vc.getSubject();
    const subjectProperties = subject.getProperties();

    if (Object.values(subjectProperties)[0]) {
      const value = Object.values(subjectProperties)[0];

      const valueStr = value.toString().split('***');
      if (valueStr.length > 0) {
        const category = valueStr[0];
        const content = valueStr[1];
        if (
          category.toLocaleLowerCase().includes(id.toLocaleLowerCase()) &&
          content &&
          content !== ''
        ) {
          let verifier = content.toString().replace('Verified_By_', '');
          let nameAndDid = verifier.split('(');
          let name = nameAndDid[0];
          let did = nameAndDid[1].replace('(', '').replace(')', '');
          return {
            name,
            did
          };
        }
      }
    }

    return null;
  });

  vcs = vcs.filter((item: any) => {
    return item !== undefined && item !== null;
  });

  if (vcs && vcs.length > 0) return vcs;
  return [];
};
