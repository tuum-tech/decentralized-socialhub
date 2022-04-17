import React from 'react';
import styled from 'styled-components';

import LinkButton from 'src/elements-v2/buttons/LinkButton';
import { MainCard, CardTitle } from './VerificationStatus';
import discordImg from '../../../../../../assets/icon/discord.jpg';

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

const ConnectWithCommunity: React.FC = () => {
  return (
    <StyledCard>
      <div className="left">
        <CardTitle>Connect with our community</CardTitle>
        <LinkButton
          variant="outlined"
          color="primary-gradient"
          textType="gradient"
          href="https://discord.gg/profile-mtrl"
          target="_blank"
        >
          Join us on Discord
        </LinkButton>
      </div>
      <div className="right">
        <img src={discordImg} alt="discord" />
      </div>
    </StyledCard>
  );
};

export default ConnectWithCommunity;
