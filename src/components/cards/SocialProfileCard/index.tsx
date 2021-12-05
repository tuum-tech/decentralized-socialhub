import React from 'react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import SocialCard from './SocialCard';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

interface Props extends InferMappedProps {
  didDocument: DIDDocument;
  targetUser?: ISessionItem;
  setSession: (props: { session: ISessionItem }) => void;
  mode?: string;
  openModal?: boolean;
}

const SocialProfiles: React.FC<Props> = ({ eProps, ...props }: Props) => {
  const user = props.targetUser ? props.targetUser : props.session;

  if (props.mode === 'edit' || props.didDocument.getCredentialCount() > 0) {
    return (
      <SocialCard
        sessionItem={user}
        setSession={props.setSession}
        diddocument={props.didDocument}
        mode={props.mode}
        openModal={props.openModal}
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
