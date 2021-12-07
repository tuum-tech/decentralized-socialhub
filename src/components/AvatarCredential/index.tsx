import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import style from './style.module.scss';
import { VerifiableCredential } from '@elastosfoundation/did-js-sdk/typings/';

interface AvatarCredentialProps {
  credential?: VerifiableCredential | undefined;
  width?: string;
}

const ContentDiv = styled.div`
  min-width: 40px;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f8fa;
  color: #7a7a9d;
  font-weight: bold;
`;

const AvatarCredential: React.FC<AvatarCredentialProps> = ({
  credential = undefined,
  width = '86px'
}: AvatarCredentialProps) => {
  const getAvatarSrc = () => {
    if (credential === undefined) return '';

    let value = credential.getSubject().getProperties()['avatar'];

    let jsonValue = JSON.stringify(value);
    let avatarObject = JSON.parse(jsonValue);
    let baseStr = avatarObject['data'];
    if (!baseStr.startsWith('data:image/'))
      return `data:${avatarObject['content-type']};base64,${baseStr}`;

    return '';
  };

  return (
    <div className={style['avatar']} style={{ height: width, width }}>
      <img
        src={getAvatarSrc()}
        className={style['border-primary']}
        height="auto"
        alt="avatar"
      />
    </div>
  );
};

export default AvatarCredential;
