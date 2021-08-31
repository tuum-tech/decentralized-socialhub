import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import SocialCard from './SocialCard';
import {
  DIDDocument,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import { DidService } from 'src/services/did.service.new';
import { DidDocumentService } from 'src/services/diddocument.service';

interface Props extends InferMappedProps {
  didDocument: DIDDocument;
  targetUser?: ISessionItem;
  setSession: (props: { session: ISessionItem }) => void;
  mode?: string;
}

const SocialProfiles: React.FC<Props> = ({ eProps, ...props }: Props) => {
  const [document, setDocument] = useState(props.didDocument);
  const [isLoaded, setIsLoaded] = useState(false);

  const user = props.targetUser ? props.targetUser : props.session;

  const hasCredential = (document: DIDDocument, key: string): boolean => {
    if (
      document.selectCredentials(key.toLowerCase(), 'InternetAccountCredential')
        .length > 0
    )
      return true;

    return false;
  };

  const addCredentialToDocument = async (
    document: DIDDocument,
    key: CredentialType,
    value: string
  ) => {
    let vc = await DidcredsService.generateVerifiableCredential(
      props.session.did,
      key,
      value
    );
    let verifiableCredential = await VerifiableCredential.parseContent(
      JSON.stringify(vc)
    );
    let didService = await DidService.getInstance();

    let docWithCredential = await didService.addVerifiableCredentialToDIDDocument(
      document,
      verifiableCredential
    );

    await didService.storeDocument(docWithCredential);
    setDocument(docWithCredential);
  };
  useEffect(() => {
    (async () => {
      if (user.loginCred) {
        const { loginCred } = user;
        if (
          loginCred.google &&
          !hasCredential(document, CredentialType.Google)
        ) {
          await addCredentialToDocument(
            document,
            CredentialType.Google,
            loginCred.google
          );
        }
        if (
          loginCred.facebook &&
          !hasCredential(document, CredentialType.Facebook)
        ) {
          await addCredentialToDocument(
            document,
            CredentialType.Facebook,
            loginCred.facebook
          );
        }
        if (
          loginCred.twitter &&
          !hasCredential(document, CredentialType.Twitter)
        ) {
          await addCredentialToDocument(
            document,
            CredentialType.Twitter,
            loginCred.twitter
          );
        }
        if (
          loginCred.linkedin &&
          !hasCredential(document, CredentialType.Linkedin)
        ) {
          await addCredentialToDocument(
            document,
            CredentialType.Linkedin,
            loginCred.linkedin
          );
        }
        if (
          loginCred.github &&
          !hasCredential(document, CredentialType.Github)
        ) {
          await addCredentialToDocument(
            document,
            CredentialType.Github,
            loginCred.github
          );
        }
        if (
          loginCred.discord &&
          !hasCredential(document, CredentialType.Discord)
        ) {
          await addCredentialToDocument(
            document,
            CredentialType.Discord,
            loginCred.discord
          );
        }
      }
      setIsLoaded(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (
    (props.mode === 'edit' || document.getCredentialCount() > 0) &&
    isLoaded
  ) {
    return (
      <SocialCard
        sessionItem={user}
        setSession={props.setSession}
        diddocument={document}
        mode={props.mode}
      />
    );
  }
  return <></>;
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SocialProfiles);
