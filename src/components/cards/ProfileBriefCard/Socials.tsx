import { DIDDocument } from '@elastosfoundation/did-js-sdk/';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import style from './Socials.module.scss';
import linkedinIcon from 'src/assets/icon/Linkedin.svg';
import twitterIcon from 'src/assets/icon/Twitter.svg';
import facebookIcon from 'src/assets/icon/Facebook.svg';
import googleIcon from 'src/assets/icon/Google.svg';
import githubIcon from 'src/assets/icon/Github.svg';
import discordIcon from 'src/assets/icon/Discord.svg';
import shieldIcon from 'src/assets/icon/shield.svg';
import {
  VCType,
  containingVerifiableCredentialDetails
} from 'src/utils/credential';

import { useRecoilValue } from 'recoil';
import { DIDDocumentAtom } from 'src/Atoms/Atoms';

const SocialContainer = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileItem = styled.div`
  position: relative;
  padding: 0px;
  margin-right: 10px;
`;
interface Props {
  cb: (count: number) => void;
}

const getIcon = (type: string) => {
  if (type === 'linkedin') {
    return linkedinIcon;
  }
  if (type === 'facebook') {
    return facebookIcon;
  }
  if (type === 'twitter') {
    return twitterIcon;
  }
  if (type === 'google') {
    return googleIcon;
  }
  if (type === 'github') {
    return githubIcon;
  }
  if (type === 'discord') {
    return discordIcon;
  }
};
const Socials: React.FC<Props> = ({ cb }) => {
  const [socials, setSocials] = useState<any[]>([]);
  const wSize = [1780, 1600, 1350, 1120];
  let didDocValue = useRecoilValue(DIDDocumentAtom);
  const didDocument =
    didDocValue === undefined ? undefined : DIDDocument._parseOnly(didDocValue);

  useEffect(() => {
    (async () => {
      let _socials = [
        'linkedin',
        'facebook',
        'twitter',
        'google',
        'github',
        'discord'
      ];

      let socialDetails = [];
      for (let i = 0; i < _socials.length; i++) {
        const sc = await containingVerifiableCredentialDetails(
          _socials[i],
          didDocument as DIDDocument
        );
        if (sc.isVerified) {
          socialDetails.push(sc);
        }
      }
      setSocials(socialDetails);
      cb(socialDetails.length);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didDocument]);

  const createIonItem = (key: string, vc: VCType) => {
    if (!vc) return;
    return (
      <ProfileItem className={style['social-profile-item']}>
        <img
          alt="icon"
          src={getIcon(key)}
          className={style['social-profile-icon']}
          height={50}
        />
        {vc.isValid && (
          <img
            alt="shield icon"
            src={shieldIcon}
            className={style['social-profile-badge']}
            height={15}
          />
        )}
      </ProfileItem>
    );
  };

  return (
    <SocialContainer>
      {socials.slice(0, 5).map((social: VCType, index) => {
        return (
          <div
            style={{
              display: window.innerWidth > wSize[3 - index] ? 'block' : 'none'
            }}
            key={index}
          >
            {createIonItem(social.id, social)}
          </div>
        );
      })}
    </SocialContainer>
  );
};

export default Socials;
