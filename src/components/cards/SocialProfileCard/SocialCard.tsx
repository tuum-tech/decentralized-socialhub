import React, { useEffect, useState } from 'react';
import { IonCardTitle, IonCol, IonGrid, IonRow } from '@ionic/react';
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
import spinner from '../../../assets/icon/spinner.gif';
import { DidService } from 'src/services/did.service.new';

import { SocialProfileCard, MyGrid } from './elements';

import {
  ManagerModal,
  ManagerModalTitle,
  ManagerModalFooter,
  ManagerLogo,
  ProfileItem,
  ManagerButton,
  CloseButton,
  CardHeaderContent,
  CardContentContainer
} from '../common';

import {
  VerifiableCredential,
  DIDDocument,
  DID
} from '@elastosfoundation/did-js-sdk/';
import { useSetRecoilState, useRecoilState } from 'recoil';
import { BadgesAtom, DIDDocumentAtom, CallbackFromAtom } from 'src/Atoms/Atoms';
import { VerificationService } from 'src/services/verification.service';
import styled from 'styled-components';

const Alert = styled.span`
  color: red;
`;

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
  const setBadges = useSetRecoilState(BadgesAtom);
  const setCallbackFrom = useSetRecoilState(CallbackFromAtom);
  const [didDocument, setDidDocument] = useRecoilState(DIDDocumentAtom);
  const [isManagerOpen, setIsManagerOpen] = useState(openModal);
  const [isRemoving, setIsRemoving] = useState<boolean>(false);
  const socialCredentials = [
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
      name: 'facebook',
      display: 'Facebook',
      credential: undefined,
      icon: facebookIcon
    },
    {
      name: 'google',
      display: 'Google',
      credential: undefined,
      icon: googleIcon
    },
    {
      name: 'github',
      display: 'Github',
      credential: undefined,
      icon: githubIcon
    },
    {
      name: 'discord',
      display: 'Discord',
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

  useEffect(() => {
    (async () => {
      if (didDocument === '') {
        let updatedDidDocument: DIDDocument = (await DID.from(
          sessionItem.did
        )?.resolve(true)) as DIDDocument;
        setDidDocument(updatedDidDocument.toString());
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionItem]);

  useEffect(() => {
    (async () => {
      await getCredentials(sessionItem);
      let userService = new UserService(await DidService.getInstance());

      let user: ISessionItem = await userService.SearchUserWithDID(
        sessionItem.did
      );
      setBadges(user.badges as IBadges);
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
    if (didDocument === '') return;
    let didDocumentParsed = DIDDocument._parseOnly(didDocument);
    let credsFromDidDocument = await DidcredsService.getSocialCredentials(
      didDocumentParsed
    );

    let newCredentials = credentials.map(item => {
      item.credential = credsFromDidDocument.find(
        cred => cred.id.getFragment() === item.name
      );
      return item;
    });

    setCredentials(newCredentials);
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

    var timer = setInterval(async function() {
      if (popupwindow!.closed) {
        clearInterval(timer);

        await forceUpdateDidDocument();
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

  const getUrlFromService = (
    service: string,
    credential: VerifiableCredential
  ): string => {
    let value = credential.getSubject().getProperty(service) as string;
    if (service === 'twitter') return `https://twitter.com/${value}`;
    if (service === 'linkedin') return `https://linkedin.com/in/${value}`;
    if (service === 'facebook') return `https://facebook.com/${value}`;
    if (service === 'google') return `mailto://${value}`;
    if (service === 'github') return `https://github.com/${value}`;
    if (service === 'discord') return `https://discordapp.com/users/${value}`;
    return '';
  };

  const parseValueFromService = (
    service: string,
    credential: VerifiableCredential
  ): string => {
    let value = credential.subject.getProperty(service);

    if (service === 'twitter') return value;
    if (service === 'linkedin') return `linkedin.com/in/${value}`;
    if (service === 'facebook') return `facebook.com/${value}`;
    if (service === 'google') return `${value}`;
    if (service === 'github') return `${value}`;
    if (service === 'discord') return `${value}`;
    return '';
  };

  const removeVc = async (key: string) => {
    setIsRemoving(true);

    let vcId = sessionItem.did + '#' + key;
    let vService = new VerificationService();
    let deletedCreds = await vService.deleteCredentials(vcId);

    if (deletedCreds[0] === vcId) {
      forceUpdateDidDocument();
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
      } else if (key === 'discord' && newLoginCred.discord) {
        newLoginBadges.socialVerify.discord.archived = false;
        delete newLoginCred.discord;
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
    }
    setIsRemoving(false);
  };

  if (credentials === undefined) return <></>;

  return (
    <>
      <SocialProfileCard template={template}>
        <CardHeaderContent>
          <IonCardTitle>
            Social Profiles
            {mode === 'edit' && (
              <span
                className="card-link"
                onClick={() => {
                  setIsManagerOpen(true);
                }}
              >
                Manage Profiles
              </span>
            )}
          </IonCardTitle>
        </CardHeaderContent>
        <CardContentContainer>
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
                          <img
                            alt="icon"
                            src={credentialItem.icon}
                            height={50}
                          />
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
                          {(credentialItem.name === 'facebook' ||
                            credentialItem.name === 'linkedin') && (
                            <span className="social-profile-id">
                              {parseValueFromService(
                                credentialItem.name,
                                credentialItem.credential
                              )}
                            </span>
                          )}
                          {(credentialItem.name === 'google' ||
                            credentialItem.name === 'twitter' ||
                            credentialItem.name === 'github' ||
                            credentialItem.name === 'discord') && (
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
                          )}
                        </div>
                      </ProfileItem>
                    </IonCol>
                  ) : (
                    <></>
                  );
                })}
            </IonRow>
          </IonGrid>
        </CardContentContainer>
      </SocialProfileCard>

      <ManagerModal
        isOpen={isManagerOpen}
        cssClass="my-custom-class"
        backdropDismiss={false}
      >
        <MyGrid class="ion-no-padding">
          <IonRow>
            <ManagerModalTitle>Manage Links</ManagerModalTitle>
          </IonRow>

          {credentials?.map(credentialItem => {
            let credential = credentialItem.credential;

            return (
              <IonRow key={`creds${credentialItem.name}`} no-padding>
                <IonCol class="ion-no-padding">
                  {credential === undefined ? (
                    <div className={style['manage-links-item']}>
                      <ManagerLogo src={credentialItem.icon} />
                      <ManagerButton
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
        </MyGrid>
        <ManagerModalFooter className="ion-no-border">
          {isRemoving ? (
            <IonRow className="ion-justify-content-around">
              <IonCol size="auto">
                <img src={spinner} height="20px" alt="spinner" />
                <Alert>Please confirm deletion on Essentials</Alert>
              </IonCol>
            </IonRow>
          ) : (
            <></>
          )}
          <IonRow className="ion-justify-content-around">
            <IonCol size="auto">
              <CloseButton
                disabled={isRemoving}
                onClick={() => {
                  setIsManagerOpen(false);
                }}
              >
                Close
              </CloseButton>
            </IonCol>
          </IonRow>
        </ManagerModalFooter>
      </ManagerModal>
    </>
  );
};

export default SocialProfilesCard;
