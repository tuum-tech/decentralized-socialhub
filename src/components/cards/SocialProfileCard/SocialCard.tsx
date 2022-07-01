import React, { useEffect, useRef, useState } from 'react';
import { IonCol, IonGrid, IonRow } from '@ionic/react';
import TwitterApi from 'src/shared-base/api/twitter-api';
import { DidcredsService } from 'src/services/didcreds.service';
import { UserService } from 'src/services/user.service';

import style from './SocialCard.module.scss';
import linkedinIcon from '../../../assets/icon/Linkedin.svg';
import twitterIcon from '../../../assets/icon/Twitter.svg';
import facebookIcon from '../../../assets/icon/Facebook.svg';
import googleIcon from '../../../assets/icon/Google.svg';
import githubIcon from '../../../assets/icon/Github.svg';
import discordIcon from '../../../assets/icon/Discord.svg';
import shieldIcon from '../../../assets/icon/shield.svg';
import { DidService } from 'src/services/did.service.new';

import {
  ManagerLogo,
  ProfileItem,
  ManagerButton,
  LinkStyleSpan
} from '../common';

import {
  VerifiableCredential,
  DIDDocument,
  DID
} from '@elastosfoundation/did-js-sdk/';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { BadgesAtom, DIDDocumentAtom, CallbackFromAtom } from 'src/Atoms/Atoms';
import { VerificationService } from 'src/services/verification.service';
import Card from 'src/elements-v2/Card';
import Modal from 'src/elements-v2/Modal';

interface Props {
  sessionItem: ISessionItem;
  setSession: (props: { session: ISessionItem }) => void;
  mode?: string;
  openModal?: boolean;
}

const SocialProfilesCard: React.FC<Props> = ({
  sessionItem,
  setSession,
  mode = 'view',
  openModal = false
}) => {
  const modalRef = useRef(null);
  const setBadges = useSetRecoilState(BadgesAtom);
  const setCallbackFrom = useSetRecoilState(CallbackFromAtom);
  const [didDocument, setDidDocument] = useRecoilState(DIDDocumentAtom);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const socialCredentials = [
    {
      name: 'google',
      display: 'Google',
      credential: undefined,
      icon: googleIcon
    },
    {
      name: 'facebook',
      display: 'Facebook',
      credential: undefined,
      icon: facebookIcon
    },
    {
      name: 'twitter',
      display: 'Twitter',
      credential: undefined,
      icon: twitterIcon
    },
    {
      name: 'linkedin',
      display: 'Linkedin',
      credential: undefined,
      icon: linkedinIcon
    },

    {
      name: 'github',
      display: 'Github',
      credential: undefined,
      icon: githubIcon
    },
    {
      name: 'reddit',
      display: 'Reddit',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'discord',
      display: 'Discord',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'twitch',
      display: 'Twitch',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'apple',
      display: 'Apple',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'line',
      display: 'Line',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'kakao',
      display: 'Kakao',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'weibo',
      display: 'Weibo',
      credential: undefined,
      icon: discordIcon
    },
    {
      name: 'wechat',
      display: 'Wechat',
      credential: undefined,
      icon: discordIcon
    }
  ];

  const [credentials, setCredentials] = useState<
    {
      name: string;
      display: string;
      credential: VerifiableCredential | undefined;
      icon: string;
    }[]
  >(socialCredentials);

  /*   useEffect(() => {
    (async () => {
      if (didDocument === '') {
        let updatedDidDocument: DIDDocument = (await DID.from(
          sessionItem.did
        )?.resolve(true)) as DIDDocument;
        setDidDocument(updatedDidDocument.toString());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionItem]); */

  useEffect(() => {
    (async () => {
      await getCredentials(sessionItem);
      let userService = new UserService(await DidService.getInstance());

      let user: ISessionItem = await userService.SearchUserWithDID(
        sessionItem.did
      );
      setBadges(user?.badges as IBadges);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didDocument]);

  const forceUpdateDidDocument = async () => {
    let updatedDidDocument: DIDDocument = (await DID.from(
      sessionItem.did
    )?.resolve(true)) as DIDDocument;
    setDidDocument(updatedDidDocument.toString());
  };

  const getCredentials = async (sessionItem: ISessionItem) => {
    let credsFromDidDocument: any[] = [];
    try {
      let allCreds = await DidcredsService.getAllCredentialsToVault(
        sessionItem
      );
      credsFromDidDocument = Array.from(allCreds.values());
      let newCredentials = credentials.map(item => {
        item.credential = credsFromDidDocument.find(
          cred => cred.id.getFragment() === item.name
        );
        return item;
      });
      setCredentials(newCredentials);
    } catch (error) {
      console.error('Error getting credentials from vault', error);
    }
  };

  let template = 'default';
  if (mode !== 'edit' && sessionItem.pageTemplate) {
    template = sessionItem.pageTemplate;
  }

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

    setInterval(async function() {
      if (popupwindow!.closed) {
        //clearInterval(timer);

        //if (sessionItem.isEssentialUser) await forceUpdateDidDocument();
        await getCredentials(sessionItem);
      }
    }, 1000);
  };

  const sociallogin = async (socialType: string) => {
    type MyType = { meta: string; data: string };
    let url: MyType = {} as MyType;

    if (socialType === 'google') {
      url = (await DidcredsService.requestGoogleLogin()) as MyType;
    } else if (socialType === 'twitter') {
      url = (await DidcredsService.requestGoogleLogin()) as MyType;
    }

    if (url) {
      popupCenter(url.data, 'Login', 548, 725);
    }
  };

  const getUrlFromService = (
    service: string,
    credential: VerifiableCredential
  ): string => {
    let value = credential.getSubject().getProperty(service) as string;
    if (service === 'google') return `mailto://${value}`;
    if (service === 'facebook') return `https://facebook.com/${value}`;
    if (service === 'twitter') return `https://twitter.com/${value}`;
    if (service === 'linkedin') return `https://linkedin.com/in/${value}`;
    if (service === 'github') return `https://github.com/${value}`;
    if (service === 'reddit') return `https://github.com/${value}`;
    if (service === 'discord') return `https://discordapp.com/users/${value}`;
    if (service === 'twitch') return `https://github.com/${value}`;
    if (service === 'apple') return `https://github.com/${value}`;
    if (service === 'line') return `https://github.com/${value}`;
    if (service === 'kakao') return `https://github.com/${value}`;
    if (service === 'weibo') return `https://github.com/${value}`;
    if (service === 'wechat') return `https://github.com/${value}`;
    return '';
  };

  const parseValueFromService = (
    service: string,
    credential: VerifiableCredential
  ): string => {
    let value = credential.subject.getProperty(service);
    if (service === 'google') return `${value}`;
    if (service === 'facebook') return `${value}`;
    if (service === 'twitter') return `${value}`;
    if (service === 'linkedin') return `${value}`;
    if (service === 'github') return `${value}`;
    if (service === 'reddit') return `${value}`;
    if (service === 'discord') return `${value}`;
    if (service === 'twitch') return `${value}`;
    if (service === 'apple') return `${value}`;
    if (service === 'line') return `${value}`;
    if (service === 'kakao') return `${value}`;
    if (service === 'weibo') return `${value}`;
    if (service === 'wechat') return `${value}`;
    return '';
  };

  const removeVc = async (key: string) => {
    setIsRemoving(true);

    let vcId = sessionItem.did + '#' + key;
    if (sessionItem.isEssentialUser) {
      let vService = new VerificationService();
      await vService.deleteCredentials(vcId);
    }
    try {
      await DidcredsService.removeCredentialToVault(sessionItem, vcId);
      forceUpdateDidDocument();
    } catch (error) {
      console.error('Error getting credentials from vault', error);
    }

    let didService = await DidService.getInstance();

    let userService = new UserService(didService);
    let currentSession = await userService.SearchUserWithDID(sessionItem.did);

    // ===== temporary codes start =====
    let newLoginCred = currentSession!.loginCred;
    let newLoginBadges = currentSession!.badges;
    if (!newLoginCred) {
      return;
    }
    if (key === 'google' && newLoginCred.google) {
      delete newLoginCred.google;
      newLoginBadges.socialVerify.google.archived = false;
    } else if (key === 'facebook' && newLoginCred.facebook) {
      delete newLoginCred.facebook;
      newLoginBadges.socialVerify.facebook.archived = false;
    } else if (key === 'linkedin' && newLoginCred.linkedin) {
      newLoginBadges.socialVerify.linkedin.archived = false;
      delete newLoginCred.linkedin;
    } else if (key === 'twitter' && newLoginCred.twitter) {
      delete newLoginCred.twitter;
      newLoginBadges.socialVerify.twitter.archived = false;
    } else if (key === 'github' && newLoginCred.github) {
      delete newLoginCred.github;
      newLoginBadges.socialVerify.github.archived = false;
    } else if (key === 'reddit' && newLoginCred.reddit) {
      newLoginBadges.socialVerify.reddit.archived = false;
      delete newLoginCred.reddit;
    } else if (key === 'discord' && newLoginCred.discord) {
      newLoginBadges.socialVerify.discord.archived = false;
      delete newLoginCred.discord;
    } else if (key === 'twitch' && newLoginCred.twitch) {
      newLoginBadges.socialVerify.twitch.archived = false;
      delete newLoginCred.twitch;
    } else if (key === 'apple' && newLoginCred.apple) {
      newLoginBadges.socialVerify.apple.archived = false;
      delete newLoginCred.apple;
    } else if (key === 'line' && newLoginCred.line) {
      newLoginBadges.socialVerify.line.archived = false;
      delete newLoginCred.line;
    } else if (key === 'kakao' && newLoginCred.kakao) {
      newLoginBadges.socialVerify.kakao.archived = false;
      delete newLoginCred.kakao;
    } else if (key === 'weibo' && newLoginCred.weibo) {
      newLoginBadges.socialVerify.weibo.archived = false;
      delete newLoginCred.weibo;
    } else if (key === 'wechat' && newLoginCred.wechat) {
      newLoginBadges.socialVerify.wechat.archived = false;
      delete newLoginCred.wechat;
    }
    const newUserSession = {
      ...sessionItem,
      loginCred: newLoginCred,
      badges: newLoginBadges
    } as ISessionItem;

    setSession({
      session: await userService.updateSession(newUserSession)
    });
    // ===== temporary codes end =====

    setIsRemoving(false);
  };

  if (credentials === undefined) return <></>;

  return (
    <>
      <Card
        template={template}
        title="Social Profiles"
        action={
          mode === 'edit' && (
            <LinkStyleSpan
              onClick={() => {
                (modalRef?.current as any).open();
              }}
            >
              Manage Profiles
            </LinkStyleSpan>
          )
        }
      >
        <IonGrid className={style['social-profile-grid']}>
          <IonRow>
            {credentials
              .filter(item => item.credential !== undefined)
              ?.map(credentialItem => {
                return credentialItem.credential !== undefined ? (
                  <IonCol
                    key={credentialItem.credential.id.toString()}
                    size={mode === 'edit' ? '6' : '12'}
                  >
                    <ProfileItem template={template}>
                      <div className="left">
                        <img alt="icon" src={credentialItem.icon} height={50} />
                        <img
                          alt="shield icon"
                          src={shieldIcon}
                          className="social-profile-badge"
                          height={15}
                        />
                      </div>
                      <div className="right">
                        <p className="social-profile-network">
                          {credentialItem.name.replace(
                            /^./,
                            credentialItem.name[0].toUpperCase()
                          )}
                        </p>
                        <a
                          href={getUrlFromService(
                            credentialItem.name,
                            credentialItem.credential
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="social-profile-id"
                        >
                          {parseValueFromService(
                            credentialItem.name,
                            credentialItem.credential
                          )}
                        </a>
                      </div>
                    </ProfileItem>
                  </IonCol>
                ) : (
                  <></>
                );
              })}
          </IonRow>
        </IonGrid>
      </Card>

      <Modal title="Manage Links" ref={modalRef} noButton>
        {credentials?.map(credentialItem => {
          let credential = credentialItem.credential;

          return (
            <IonRow key={`creds${credentialItem.name}`} no-padding>
              <IonCol class="ion-no-padding">
                {credential === undefined ? (
                  <div className={style['manage-links-item']}>
                    <ManagerLogo src={credentialItem.icon} />
                    <ManagerButton
                      variant="outlined"
                      btnColor="primary-gradient"
                      textType="gradient"
                      size="small"
                      onClick={() => {
                        setCallbackFrom(null);
                        sociallogin(credentialItem.name);
                      }}
                    >
                      Add
                    </ManagerButton>
                    <span className={style['manage-links-header']}>
                      {credentialItem.display}
                    </span>
                  </div>
                ) : (
                  <div className={style['manage-links-item']}>
                    <ManagerLogo src={credentialItem.icon} />
                    <ManagerButton
                      variant="outlined"
                      btnColor="primary-gradient"
                      textType="gradient"
                      size="small"
                      disabled={isRemoving}
                      onClick={() => {
                        removeVc(credentialItem.name);
                      }}
                    >
                      Remove
                    </ManagerButton>
                    <span className={style['manage-links-header']}>
                      {credentialItem.display}
                    </span>
                    <span className={style['manage-links-detail']}>
                      {parseValueFromService(credentialItem.name, credential)}
                    </span>
                  </div>
                )}
              </IonCol>
            </IonRow>
          );
        })}
      </Modal>
    </>
  );
};

export default SocialProfilesCard;
