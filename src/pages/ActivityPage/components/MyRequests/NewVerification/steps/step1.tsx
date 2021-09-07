import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  .title {
    font-weight: 600;
    font-size: 28px;
    line-height: 136.02%;
    color: #27272e;
    margin-bottom: 88px;
  }
  .intro {
    font-size: 16px;
    line-height: 162.02%;
    font-feature-settings: 'salt' on;
    color: #27272e;
  }
`;

interface Props {
  session: ISessionItem;
  credentials: VerificationData[];
  categories: VerificationData[];
  setCredentials: (newCredentials: VerificationData[]) => void;
}

const CredentialView = ({
  session,
  credentials,
  categories,
  setCredentials
}: Props) => {
  return (
    <Container>
      <p className="">Choose Credentials</p>
      <p>Please select one record per request</p>
    </Container>
  );
};

export default CredentialView;
