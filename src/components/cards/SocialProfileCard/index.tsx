import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import { DidcredsService, CredentialType } from 'src/services/didcreds.service';
import SocialCard from './SocialCard';

interface Props extends InferMappedProps {
  didDocument: any;
  targetUser?: ISessionItem;
  mode?: string;
}

const SocialProfiles: React.FC<Props> = ({ eProps, ...props }: Props) => {
  const [document, setDocument] = useState(props.didDocument);
  const user = props.targetUser ? props.targetUser : props.session;

  useEffect(() => {
    (async () => {
      if (user.loginCred) {
        const { loginCred } = user;
        const vcs = [];
        if (loginCred.google) {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Google,
            loginCred.google
          );
          vcs.push(vc);
        }
        if (loginCred.facebook) {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Facebook,
            loginCred.facebook
          );
          vcs.push(vc);
        }
        if (loginCred.twitter) {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Twitter,
            loginCred.twitter
          );
          vcs.push(vc);
        }
        if (loginCred.linkedin) {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Linkedin,
            loginCred.linkedin
          );
          vcs.push(vc);
        }
        if (loginCred.github) {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
            CredentialType.Github,
            loginCred.github
          );
          vcs.push(vc);
        }
        if (loginCred.discord) {
          let vc = await DidcredsService.generateVerifiableCredential(
            props.session.did,
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
    props.mode === 'edit' ||
    (document.verifiableCredential && document.verifiableCredential.length > 0)
  ) {
    return (
      <SocialCard
        sessionItem={user}
        setSession={({ session }) => {
          if (!props.targetUser) {
            eProps.setSession({ session });
          }
        }}
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
