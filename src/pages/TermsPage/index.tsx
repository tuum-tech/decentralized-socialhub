import React from 'react';
import { IonCard, IonCardContent, IonPage } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import Header from './components/Header';
import Content from './components/Content';

const Container = styled.div`
  margin: 0px 270px;
`;
const Title = styled.h1`
  color: black;
  font-weight: bold !important;
`;
const Description = styled.p`
  margin: 15px 0px !important;
`;
const ModifyDate = styled.p`
  margin: 15px 0px !important;
`;
const Body = styled(IonCard)`
  padding: 10px;
  box-shadow: none;
`;
const ContentWrapper = styled(IonCardContent)``;
const Page = styled(IonPage)`
  overflow: auto;
`;

// const TermsPage: React.FC = () => {
const TermsPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  return (
    <Page>
      <Header userSession={props.session} />
      <Container>
        <Body>
          <ContentWrapper>
            <Title>Profile Terms of Use</Title>
            <ModifyDate>Last modified: May 7, 2020</ModifyDate>
            <Description>
              Terms and conditions (also referred to as terms of use or terms of
              service) are a form of legal agreement outlining rules and
              restrictions for customers to follow when using you site
            </Description>
            <Content />
          </ContentWrapper>
        </Body>
      </Container>
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

export default connect(mapStateToProps, mapDispatchToProps)(TermsPage);
