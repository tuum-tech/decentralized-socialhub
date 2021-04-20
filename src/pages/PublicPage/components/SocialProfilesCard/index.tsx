import React, { useState, useEffect } from 'react';

import SocialProfilesCard from 'src/components/cards/SocialProfilesCard';
import { DidcredsService, CredentialType } from 'src/services/didcreds.service';

interface Props {
  didDocument: any;
  sessionItem: ISessionItem;
}

const SocialProfiles: React.FC<Props> = ({ didDocument, sessionItem }) => {
  const [document, setDocument] = useState(didDocument);

  useEffect(() => {
    (async () => {
      if (sessionItem.loginCred) {
        const { loginCred } = sessionItem;
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
        setDocument({
          ...document,
          verifiableCredential: vcs
        });
      }
    })();
  }, []);

  if (
    document.verifiableCredential &&
    document.verifiableCredential.length > 0
  ) {
    return (
      <SocialProfilesCard
        diddocument={document}
        showManageButton={false}
        sessionItem={sessionItem}
      />
    );
  }
  return <></>;
};

export default SocialProfiles;
