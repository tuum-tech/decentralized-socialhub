import React from 'react';
import styled from 'styled-components';

import { DefaultLinkButton } from 'src/elements/buttons';
import { MainCard, CardTitle } from './VerificationStatus';
import discordImg from '../../../../../../assets/icon/discord.jpg';

const CommunityCard = styled(MainCard)`
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

const LinkButton = styled(DefaultLinkButton)`
  margin-top: 17px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 15px 25px;
  background: transparent;

  width: 157px;
  height: 42px;

  border: 1px solid #5865f2;
  box-sizing: border-box;
  border-radius: 9px;

  font-style: normal;
  font-weight: 600;
  font-size: 12px;
  line-height: 12px;
  color: #5865f2;
`;

const ConnectWithCommunity: React.FC = () => {
  return (
    <CommunityCard>
      <div className="left">
        <CardTitle>Connect with our community</CardTitle>
        <LinkButton href="https://discord.gg/profile-mtrl" target="_blank">
          Join us on Discord
        </LinkButton>
      </div>
      <div className="right">
        <img src={discordImg} alt="discord" />
      </div>
    </CommunityCard>
  );
};

export default ConnectWithCommunity;
