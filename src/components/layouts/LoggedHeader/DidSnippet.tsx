import React from 'react';
import { IonText } from '@ionic/react';
import styled from 'styled-components';

import did_icon from '../../../assets/icon/did.svg';

const SmallIcon = styled.img`
  width: 10px;
  height: 11px;
  display: inline !important;
`;

const TruncatedSpan = styled.span`
  width: 100px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ProfileDesignation = styled(IonText)`
  font-family: 'SF Pro Display';
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.62;
  letter-spacing: normal;
  text-align: left;
  color: #979797;
`;

interface IProp {
  did: string;
}

const DidSnippet: React.FC<IProp> = ({ did }: IProp) => {
  return (
    <ProfileDesignation>
      <SmallIcon src={did_icon} alt="did" />
      &nbsp;<TruncatedSpan>{did}</TruncatedSpan>
    </ProfileDesignation>
  );
};

export default DidSnippet;
