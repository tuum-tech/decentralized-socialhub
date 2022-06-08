import React, { useEffect, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import { useSetRecoilState } from 'recoil';
import { CallbackFromAtom, SyncSpaceAtom } from 'src/Atoms/Atoms';
import TwitterApi from 'src/shared-base/api/twitter-api';
import { DidcredsService } from 'src/services/didcreds.service';

import style from './style.module.scss';
import linkedinIcon from 'src/assets/icon/Linkedin.svg';
import twitterIcon from 'src/assets/icon/Twitter.svg';
import facebookIcon from 'src/assets/icon/Facebook.svg';
import googleIcon from 'src/assets/icon/Google.svg';
import githubIcon from 'src/assets/icon/Github.svg';
import discordIcon from 'src/assets/icon/Discord.svg';
import shieldIcon from 'src/assets/icon/shield.svg';

import {
  ManagerLogo,
  ProfileItem,
  ManagerButton,
  LinkStyleSpan
} from 'src/components/cards/common';
import { SpaceService } from 'src/services/space.service';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

interface Props {
  space: any;
  mode?: string;
  openModal?: boolean;
}

const SocialProfilesCard: React.FC<Props> = ({
  space,
  mode = 'view',
  openModal = false
}) => {
  const [isManagerOpen, setIsManagerOpen] = useState(openModal);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const [credentials, setCredentials] = useState<any>({});
  const setCallbackFrom = useSetRecoilState(CallbackFromAtom);
  const setSyncSpace = useSetRecoilState(SyncSpaceAtom);

  useEffect(() => {
    if (space && space.socialLinks) {
      setCredentials(space.socialLinks);
    }
  }, [space]);

  let template = 'default';

  const popupCenter = (url: string, title: string, w: number, h: number) => {
    const dualScreenLeft =
      window.screenLeft !== undefined ? window.screenLeft : window.screenX;
    const dualScreenTop =
      window.screenTop !== undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
      ? document.documentElement.clientWidth
      : window.screen.width;
    const height = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
      ? document.documentElement.clientHeight
      : window.screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft;
    const top = (height - h) / 2 / systemZoom + dualScreenTop;

    let popupwindow = window.open(
      url,
      title,
      `
      scrollbars=yes,
      width=${w / systemZoom}, 
      height=${h / systemZoom}, 
      top=${top}, 
      left=${left}
      `
    );

    var timer = setInterval(async function() {
      if (popupwindow!.closed) {
        clearInterval(timer);
        setSyncSpace(true);
      }
    }, 1000);
  };

  const sociallogin = async (socialType: string) => {
    if (socialType === 'twitter') {
      type MyType = { meta: string; data: { request_token: string } };
      const response = (await TwitterApi.GetRequestToken()) as MyType;
      popupCenter(
        `https://api.twitter.com/oauth/authorize?oauth_token=${response.data.request_token}`,
        'Login',
        548,
        325
      );
      return;
    }

    type MyType = { meta: string; data: string };
    let url: MyType = {} as MyType;

    if (socialType === 'google') {
      // gets the google auth endpoint
      url = (await DidcredsService.requestGoogleLogin()) as MyType;
    } else if (socialType === 'facebook') {
      // gets the facebook auth endpoint
      url = (await DidcredsService.requestFacebookLogin()) as MyType;
    } else if (socialType === 'linkedin') {
      // gets the linkedin auth endpoint
      url = (await DidcredsService.requestLinkedinLogin()) as MyType;
    } else if (socialType === 'github') {
      // gets the github auth endpoint
      url = (await DidcredsService.requestGithubLogin()) as MyType;
    } else if (socialType === 'discord') {
      // gets the discord auth endpoint
      url = (await DidcredsService.requestDiscordLogin()) as MyType;
    }

    if (url) {
      popupCenter(url.data, 'Login', 548, 725);
    }
  };

  const containsVerifiedCredential = (id: string): boolean => {
    // if (!credentials) return false;
    // return credentials.has(`${sessionItem.did}#${id}`);
    return !!credentials[id];
  };

  const getUrlFromService = (service: string, credential: string): string => {
    if (service === 'twitter') return `https://twitter.com/${credential}`;
    if (service === 'linkedin') return `https://linkedin.com/in/${credential}`;
    if (service === 'facebook') return `https://facebook.com/${credential}`;
    if (service === 'google') return `mailto://${credential}`;
    if (service === 'github') return `https://github.com/${credential}`;
    if (service === 'discord')
      return `https://discordapp.com/users/${credential}`;
    return '';
  };

  const parseValueFromService = (
    service: string,
    credential: string
  ): string => {
    if (service === 'twitter') return credential;
    if (service === 'linkedin') return `linkedin.com/in/${credential}`;
    if (service === 'facebook') return `facebook.com/${credential}`;
    if (service === 'google') return `${credential}`;
    if (service === 'github') return `${credential}`;
    if (service === 'discord') return `${credential}`;
    return '';
  };

  const removeVc = async (key: string) => {
    setIsRemoving(true);
    const socialLinks = { ...credentials };
    delete socialLinks[key];
    await SpaceService.addSpace(null as any, { ...space, socialLinks });
    setSyncSpace(true);
    setIsRemoving(false);
  };

  const createIonItem = (key: string, icon: any) => {
    if (!credentials[key]) return <></>;

    let vc = credentials[key];
    let isVcValid = true;

    return (
      <ProfileItem template={template}>
        <div className="left">
          <img alt="icon" src={icon} height={50} />
          {isVcValid && (
            <img
              alt="shield icon"
              src={shieldIcon}
              className="social-profile-badge"
              height={15}
            />
          )}
        </div>
        <div className="right">
          <p className="social-profile-network">
            {key.replace(/^./, key[0].toUpperCase())}
          </p>
          {(key === 'facebook' || key === 'linkedin') && (
            <span className="social-profile-id">
              {parseValueFromService(key, vc)}
            </span>
          )}
          {(key === 'google' ||
            key === 'twitter' ||
            key === 'github' ||
            key === 'discord') && (
            <a
              href={getUrlFromService(key, vc)}
              target="_blank"
              rel="noopener noreferrer"
              className="social-profile-id"
            >
              {parseValueFromService(key, vc)}
            </a>
          )}
        </div>
      </ProfileItem>
    );
  };

  const createModalIonItem = (key: string, icon: any) => {
    //let parsedDoc = await getParsedDoc();

    if (!credentials) return;

    // let vc = credentials.get(`${sessionItem.did}#${key}`);
    let vc = credentials[key];

    let header = 'Google Account';
    if (key === 'twitter') header = 'Twitter Account';
    if (key === 'facebook') header = 'Facebook Account';
    if (key === 'linkedin') header = 'LinkedIn Account';
    if (key === 'github') header = 'Github Account';
    if (key === 'discord') header = 'Discord Account';

    // let isEssentials = sessionItem.mnemonics === '';

    if (vc === undefined)
      return (
        <div className={style['manage-links-item']}>
          <ManagerLogo src={icon} />
          <ManagerButton
            variant="outlined"
            btnColor="primary-gradient"
            textType="gradient"
            size="small"
            onClick={() => {
              setCallbackFrom(space);
              sociallogin(key);
            }}
          >
            Add
          </ManagerButton>
          <span className={style['manage-links-header']}>{header}</span>
        </div>
      );

    return (
      <div className={style['manage-links-item']}>
        <ManagerLogo src={icon} />
        <ManagerButton
          variant="outlined"
          btnColor="primary-gradient"
          textType="gradient"
          size="small"
          disabled={isRemoving}
          onClick={() => {
            removeVc(key);
          }}
        >
          Remove
        </ManagerButton>
        <span className={style['manage-links-header']}>{header}</span>
        <span className={style['manage-links-detail']}>
          {parseValueFromService(key, vc)}
        </span>
      </div>
    );
  };

  const linkedInItem = () => {
    return createIonItem('linkedin', linkedinIcon);
  };

  const facebookItem = () => {
    return createIonItem('facebook', facebookIcon);
  };

  const googleItem = () => {
    return createIonItem('google', googleIcon);
  };

  const twitterItem = () => {
    return createIonItem('twitter', twitterIcon);
  };

  const githubItem = () => {
    return createIonItem('github', githubIcon);
  };

  const discordItem = () => {
    return createIonItem('discord', discordIcon);
  };

  const googleModalItem = () => {
    return createModalIonItem('google', googleIcon);
  };

  const githubModalItem = () => {
    return createModalIonItem('github', githubIcon);
  };

  const discordModalItem = () => {
    return createModalIonItem('discord', discordIcon);
  };

  const twitterModalItem = () => {
    return createModalIonItem('twitter', twitterIcon);
  };

  const facebookModalItem = () => {
    return createModalIonItem('facebook', facebookIcon);
  };

  const linkedinModalItem = () => {
    return createModalIonItem('linkedin', linkedinIcon);
  };

  return (
    <>
      <Card
        template={template}
        title="Social Profiles"
        action={
          mode === 'edit' && (
            <LinkStyleSpan
              onClick={() => {
                setIsManagerOpen(true);
              }}
            >
              Manage Profiles
            </LinkStyleSpan>
          )
        }
      >
        <IonGrid className="ion-no-padding">
          <IonRow>
            {containsVerifiedCredential('linkedin') && (
              <IonCol size={mode === 'edit' ? '6' : '12'}>
                {linkedInItem()}
              </IonCol>
            )}
            {containsVerifiedCredential('twitter') && (
              <IonCol size={mode === 'edit' ? '6' : '12'}>
                {twitterItem()}
              </IonCol>
            )}
            {containsVerifiedCredential('facebook') && (
              <IonCol size={mode === 'edit' ? '6' : '12'}>
                {facebookItem()}
              </IonCol>
            )}
            {containsVerifiedCredential('google') && (
              <IonCol size={mode === 'edit' ? '6' : '12'}>
                {googleItem()}
              </IonCol>
            )}
            {containsVerifiedCredential('github') && (
              <IonCol size={mode === 'edit' ? '6' : '12'}>
                {githubItem()}
              </IonCol>
            )}
            {containsVerifiedCredential('discord') && (
              <IonCol size={mode === 'edit' ? '6' : '12'}>
                {discordItem()}
              </IonCol>
            )}
          </IonRow>
        </IonGrid>
      </Card>

      <Modal
        title="Manage Links"
        onClose={() => {
          setIsManagerOpen(false);
        }}
        isOpen={isManagerOpen}
        backdropDismiss={false}
        noButton
      >
        <IonGrid class="ion-no-padding">
          <IonRow no-padding>
            <IonCol class="ion-no-padding">{linkedinModalItem()}</IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">{twitterModalItem()}</IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">{facebookModalItem()}</IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">{googleModalItem()}</IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">{githubModalItem()}</IonCol>
          </IonRow>
          <IonRow no-padding>
            <IonCol class="ion-no-padding">{discordModalItem()}</IonCol>
          </IonRow>
        </IonGrid>
      </Modal>
    </>
  );
};

export default SocialProfilesCard;
