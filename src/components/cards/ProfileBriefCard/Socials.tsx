import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
//import { getVerifiedCredential } from 'src/utils/socialprofile';

import style from './Socials.module.scss';
import linkedinIcon from 'src/assets/icon/Linkedin.svg';
import twitterIcon from 'src/assets/icon/Twitter.svg';
import facebookIcon from 'src/assets/icon/Facebook.svg';
import googleIcon from 'src/assets/icon/Google.svg';
import githubIcon from 'src/assets/icon/Github.svg';
import discordIcon from 'src/assets/icon/Discord.svg';
import shieldIcon from 'src/assets/icon/shield.svg';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

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
  diddocument: DIDDocument;
  cb: (count: number) => void;
}
const Socials: React.FC<Props> = ({ diddocument, cb }) => {
  const [socials, setSocials] = useState<any[]>([]);

  const wSize = [1780, 1600, 1350, 1120];

  useEffect(() => {
    let _socials = [
      {
        key: 'linkedin',
        icon: linkedinIcon
      },
      {
        key: 'facebook',
        icon: facebookIcon
      },
      {
        key: 'twitter',
        icon: twitterIcon
      },
      {
        key: 'google',
        icon: googleIcon
      },
      {
        key: 'github',
        icon: githubIcon
      },
      {
        key: 'discord',
        icon: discordIcon
      }
    ];
    _socials = _socials.filter(social =>
      containsVerifiedCredential(social.key)
    );
    setSocials(_socials);
    cb(_socials.length);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [diddocument]);

  const createIonItem = (key: string, icon: any) => {
    let vc = diddocument.selectCredentials(
      `${diddocument.getSubject()}#${key}`,
      'InternetAccountCredential'
    )[0]; //  getVerifiedCredential(key, diddocument);
    if (!vc) return;
    return (
      <ProfileItem className={style['social-profile-item']}>
        <img
          alt="icon"
          src={icon}
          className={style['social-profile-icon']}
          height={50}
        />
        {vc.isValid() && (
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

  const containsVerifiedCredential = (id: string): boolean => {
    //return getVerifiedCredential(id, diddocument) !== undefined;
    if (diddocument === null) return false;
    return (
      diddocument.selectCredentials(
        `${diddocument.getSubject()}#${id}`,
        'InternetAccountCredential'
      ).length > 0
    );
  };

  return (
    <SocialContainer>
      {socials.slice(0, 5).map((social, index) => {
        return (
          <div
            style={{
              display: window.innerWidth > wSize[3 - index] ? 'block' : 'none'
            }}
            key={index}
          >
            {createIonItem(social.key, social.icon)}
          </div>
        );
      })}
    </SocialContainer>
  );
};

export default Socials;
