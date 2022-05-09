import React from 'react';
import styled from 'styled-components';
import { LinkButton } from 'src/elements-v2/buttons';
import { MainCard, CardTitle, CardText } from './VerificationStatus';
import mainLogo from '../../../../../../assets/new/main-logo.svg';

const StyledCard = styled(MainCard)`
  display: flex;
  justify-content: space-between;

  .left {
    margin-right: 20px;
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
`;

const WhatIsProfile: React.FC = _ => {
  return (
    <StyledCard>
      <div className="left">
        <CardTitle>What is Profile?</CardTitle>
        <CardText
          style={{
            marginTop: '4px',
            marginBottom: '26px'
          }}
        >
          Learn about what makes Profile different with its verified digital
          identities, personalized vaults & more...
        </CardText>

        <LinkButton
          variant="outlined"
          btnColor="primary-gradient"
          textType="gradient"
          href="https://www.tuum.tech"
          target="_blank"
        >
          Read More
        </LinkButton>
      </div>
      <div className="right">
        <img src={mainLogo} alt="mainLogo" />
      </div>
    </StyledCard>
  );
};

export default WhatIsProfile;
