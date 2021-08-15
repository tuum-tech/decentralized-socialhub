import React from 'react';
import { IonPage } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { SubState } from 'src/store/users/types';

import { fetchGithubIssues } from './fetchapi';

import SignedPublicPageHeader from 'src/components/layouts/SignedPublicPageHeader';
import List from './components/List';
import Detail from './components/Detail';

import { useState, useEffect } from 'react';

const Page = styled(IonPage)`
  overflow-y: auto;
  justify-content: start;
`;

const SupportForumPage: React.FC<any> = ({ eProps, ...props }: any) => {
  const githubIssueNumber = props.match.params.num;
  const [githubIssues, setGithubIssues] = useState<any[]>([]);
  const [githubIssue, setGithubIssue] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const response: any = await fetchGithubIssues();
      if (response && response.data && response.data.length > 0) {
        setGithubIssues(response.data);
      }
    })();
  }, []);

  useEffect(() => {
    if (githubIssueNumber && githubIssues.length) {
      const githubIssue = githubIssues.find(
        item => item.number.toString() === githubIssueNumber.toString()
      );
      setGithubIssue(githubIssue);
    }
  }, [githubIssueNumber, githubIssues]);

  return (
    <Page>
      <SignedPublicPageHeader userSession={props.session} />

      {githubIssue ? (
        <Detail
          githubIssue={githubIssue}
          githubIssues={githubIssues
            .sort(
              (a, b) =>
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
            )
            .slice(0, 5)}
          userSession={props.session}
        />
      ) : (
        <List githubIssues={githubIssues} />
      )}
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
