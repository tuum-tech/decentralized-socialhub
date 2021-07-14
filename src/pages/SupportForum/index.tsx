import React from 'react';
import { IonPage } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps } from './types';
import { SubState } from 'src/store/users/types';

import { fetchGithubIssues } from './fetchapi';

import SignedPublicPageHeader from 'src/components/layouts/SignedPublicPageHeader';
import Content from './components/Content';
import { useEffect } from 'react';

const Page = styled(IonPage)`
  overflow-y: auto;
  justify-content: start;
`;

const Intro = styled.div`
  background: #17171b;
  padding: 65px 12.5%;

  h1 {
    font-style: normal;
    font-weight: bold;
    font-size: 36px;
    line-height: 136.02%;
    color: #ffffff;
  }

  p {
    font-style: normal;
    font-weight: 300;
    font-size: 20px;
    line-height: 35px;

    letter-spacing: 0.02em;

    color: #cbd5e0;
  }
`;

const SupportForumPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  useEffect(() => {
    (async () => {
      await fetchGithubIssues();
    })();
  }, []);

  return (
    <Page>
      <SignedPublicPageHeader userSession={props.session} />
      <Intro>
        <h1>Feedbacks, Issues & New Features</h1>
        <p>
          Get the lastest on what profile team is working on and catchup product
          related bugs
        </p>
      </Intro>

      <Content />
    </Page>
  );
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

export default connect(mapStateToProps, mapDispatchToProps)(SupportForumPage);
