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
  const [avatarImg, setAvatarImg] = useState<string>(
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
  );

  useEffect(() => {
    (async () => {
      if (credential === undefined) return;

      let value = credential.getSubject().getProperties()['avatar'];

      let jsonValue = JSON.stringify(value);
      let avatarObject = JSON.parse(jsonValue);

      if (avatarObject['type'] === 'elastoshive') {
        //TODO: Use new hive sdk to get the avatar from node url like hive://did:elastos:idSDmjYLHdmvU4LM8fQZfobUgUkjnJF2kH@did:elastos:ig1nqyyJhwTctdLyDFbZomSbZSjyMN1uor/getMainIdentityAvatar1644321628379?params={\"empty\":0}
      } else {
        let baseStr = avatarObject['data'];
        if (!baseStr.startsWith('data:image/'))
          setAvatarImg(
            `data:${avatarObject['content-type']};base64,${baseStr}`
          );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credential]);

  return (
    <div className={style['avatar']} style={{ height: width, width }}>
      <img
        src={avatarImg}
        className={style['border-primary']}
        height="auto"
        alt="avatar"
      />
    </div>
  );
};

export default AvatarCredential;
