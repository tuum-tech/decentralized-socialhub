import React, { useState, useEffect } from 'react';

import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import SocialProfilesCard from './SocialCard';

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
        setDocument({
          ...document,
          verifiableCredential: vcs
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (
    document.verifiableCredential &&
    document.verifiableCredential.length > 0
  ) {
    return (
      <SocialProfilesCard
        showManageButton={false}
        diddocument={document}
        sessionItem={sessionItem}
      />
    );
  }
  return <></>;
};

export default SocialProfiles;
