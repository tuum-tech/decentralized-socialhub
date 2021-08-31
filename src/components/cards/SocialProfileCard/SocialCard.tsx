import React, { useState } from 'react';
import {
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow
} from '@ionic/react';
import TwitterApi from 'src/shared-base/api/twitter-api';
import { DidcredsService } from 'src/services/didcreds.service';
//import { getVerifiedCredential } from 'src/utils/socialprofile';
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
  ManagerModal,
  ManagerModalTitle,
  ManagerModalFooter,
  MyGrid,
  ManagerLogo,
  ProfileItem,
  ManagerButton,
  CloseButton,
  SocialProfileCard
} from './elements';
import {
  DIDDocument,
  DIDDocumentBuilder,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import { DidDocumentService } from 'src/services/diddocument.service';

interface Props {
  diddocument: DIDDocument;
  sessionItem: ISessionItem;
  setSession: (props: { session: ISessionItem }) => void;
  mode?: string;
}

const SocialProfilesCard: React.FC<Props> = ({
  diddocument,
  sessionItem,
  setSession,
  mode = 'view'
}) => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [parsedDoc, setParsedDoc] = useState<DIDDocument>(diddocument);

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
        let store = await DidService.getStore();
        let updatedDoc = await store.loadDid(sessionItem.did);
        console.log(updatedDoc);

        await updateDocEverywhere(updatedDoc);
      }
    }, 1000);
  };

  const updateDocEverywhere = async (doc: DIDDocument) => {
    setParsedDoc(doc);
    DidDocumentService.updateUserDocument(doc.toString(true));
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
      // gets the linkedin auth endpoint
      url = (await DidcredsService.requestGoogleLogin()) as MyType;
    } else if (socialType === 'facebook') {
      // gets the linkedin auth endpoint
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

    console.log(url, 'login url');
    if (url) {
      popupCenter(url.data, 'Login', 548, 725);
    }
  };

  // const getParsedDoc = async() : Promise<DIDDocument> => {
  //   return await DIDDocument.parseContent(doc);
  // }

  const containsVerifiedCredential = (id: string): boolean => {
    //let docParsed = await getParsedDoc();
    return (
      parsedDoc!.selectCredentials(id, 'InternetAccountCredential').length > 0
    );
  };

  const getUrlFromService = (
    service: string,
    credential: VerifiableCredential
  ): string => {
    let value = 'must get';
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

  // TODO
  const removeVc = async (key: string) => {
    let store = await DidService.getStore();
    let didFromStore = await store.loadDid(diddocument.getSubject());
    let builder = DIDDocumentBuilder.newFromDocument(didFromStore);
    builder = builder.removeCredential(key);
    let newDoc = await builder.seal(
      process.env.REACT_APP_DID_STORE_PASSWORD as string
    );

    setParsedDoc(newDoc);
    DidDocumentService.updateUserDocument(newDoc.toString(true));
    store.storeDid(newDoc);

    // ===== temporary codes start =====
    let newLoginCred = sessionItem!.loginCred;
    if (!newLoginCred) {
      return;
    }

    if (key === 'google' && newLoginCred.google) {
      delete newLoginCred.google;
    } else if (key === 'facebook' && newLoginCred.facebook) {
      delete newLoginCred.facebook;
    } else if (key === 'linkedin' && newLoginCred.linkedin) {
      delete newLoginCred.linkedin;
    } else if (key === 'twitter' && newLoginCred.twitter) {
      delete newLoginCred.twitter;
    } else if (key === 'github' && newLoginCred.github) {
      delete newLoginCred.github;
    } else if (key === 'discord' && newLoginCred.discord) {
      delete newLoginCred.discord;
    }
    const newUserSession = {
      ...sessionItem,
      loginCred: newLoginCred
    } as ISessionItem;

    let userService = new UserService(new DidService());
    setSession({
      session: await userService.updateSession(newUserSession)
    });
    // ===== temporary codes end =====
  };

  const createIonItem = (key: string, icon: any) => {
    let vc = parsedDoc!.selectCredentials(key, 'InternetAccountCredential')[0]; //getVerifiedCredential(key, doc);
    if (!vc) return <></>;
    return (
      <ProfileItem template={template}>
        <div className="left">
          <img alt="icon" src={icon} height={50} />
          {vc.isValid() && (
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
    let vc = parsedDoc.selectCredentials(key, 'InternetAccountCredential')[0];
    let header = 'Google Account';
    if (key === 'twitter') header = 'Twitter Account';
    if (key === 'facebook') header = 'Facebook Account';
    if (key === 'linkedin') header = 'LinkedIn Account';
    if (key === 'github') header = 'Github Account';
    if (key === 'discord') header = 'Discord Account';

    if (!vc)
      return (
        <div className={style['manage-links-item']}>
          <ManagerLogo src={icon} />
          <ManagerButton
            onClick={() => {
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
      <SocialProfileCard template={template}>
        <IonCardHeader>
          <IonCardTitle className="card-title">
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
        </IonCardHeader>
        <IonCardContent className="card-content">
          <IonGrid className="social-profile-grid">
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
        </IonCardContent>
      </SocialProfileCard>

      {isManagerOpen ? (
        <ManagerModal
          isOpen={isManagerOpen}
          cssClass="my-custom-class"
          backdropDismiss={false}
        >
          <MyGrid class="ion-no-padding">
            <IonRow>
              <ManagerModalTitle>Manage Links</ManagerModalTitle>
            </IonRow>
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
          </MyGrid>
          <ManagerModalFooter className="ion-no-border">
            <IonRow className="ion-justify-content-around">
              <IonCol size="auto">
                <CloseButton
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
      ) : (
        ''
      )}
    </>
  );
};

export default SocialProfilesCard;
