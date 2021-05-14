import React, { useState } from 'react';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonFooter,
  IonGrid,
  IonImg,
  IonItem,
  IonList,
  IonModal,
  IonRow
} from '@ionic/react';
import styled from 'styled-components';
import TwitterApi from 'src/shared-base/api/twitter-api';
import { DidcredsService } from 'src/services/didcreds.service';
import { UserService } from 'src/services/user.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { getVerifiedCredential } from 'src/utils/socialprofile';

import style from './SocialCard.module.scss';
import linkedinIcon from '../../../assets/icon/Linkedin.svg';
import twitterIcon from '../../../assets/icon/Twitter.svg';
import facebookIcon from '../../../assets/icon/Facebook.svg';
import googleIcon from '../../../assets/icon/Google.svg';
import shieldIcon from '../../../assets/icon/shield.svg';

interface Props {
  diddocument: any;
  showManageButton: boolean;
  sessionItem: ISessionItem;
}

interface VerifiedCredential {
  value: string;
  isVerified: boolean;
}

const ManagerModal = styled(IonModal)`
  --border-radius: 16px;
  --min-height: 200px;
  --height: 420px;
  --width: 560px;
  :host(.modal-card) ion-header ion-toolbar:first-of-type {
    padding: 0px;
  }
`;

const ManagerModalTitle = styled(IonCardTitle)`
  font-family: 'SF Pro Display';
  font-size: 28px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.36;
  letter-spacing: normal;
  text-align: left;
  color: #27272e;
`;

const ManagerModalFooter = styled(IonFooter)`
  padding: 12px;
  border: 0px !important;
  border-bottom-color: transparent !important;
  background-image: none !important;
  border-bottom: none !important;
  &.footer-md::before {
    background-image: none;
  }
`;

const MyGrid = styled(IonGrid)`
  margin: 5px 20px 0px 20px;
  height: 100 %;
`;

const ManagerLogo = styled(IonImg)`
  position: relative;
  float: left;
  width: 42px;
`;

const ProfileItem = styled(IonItem)`
  --inner-padding-bottom: 0;
  --inner-padding-end: 0;
  --inner-padding-start: 0;
  --inner-padding-top: 0;
`;

const ManagerButton = styled(IonButton)`
  position: relative;
  --ion-color-primary: transparent !important;
  --ion-color-primary-tint: transparent;
  width: 90px;
  height: 26px;
  float: right;

  font-family: 'SF Pro Display';
  border-radius: 8px;
  border: solid 1px #4c6fff;
  font-size: 13px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1.92;
  letter-spacing: normal;
  text-align: center;
  color: #4c6fff;
`;

const CloseButton = styled(IonButton)`
  --ion-color-primary: #4c6fff !important;
  --ion-color-primary-tint: #4c7aff;
  width: 210px;
  height: 36px;
  float: right;
  border-radius: 6px;
  font-family: 'SF Pro Display';
  font-size: 12px;
  font-weight: 600;
  font-stretch: normal;
  font-style: normal;
  line-height: 1;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
`;

const SocialProfilesCard: React.FC<Props> = ({
  diddocument,
  showManageButton,
  sessionItem
}) => {
  const [isManagerOpen, setIsManagerOpen] = useState(false);

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

    window.open(
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
    }

    if (url) {
      popupCenter(url.data, 'Login', 548, 725);
    }
  };

  const containsVerifiedCredential = (id: string): boolean => {
    return getVerifiedCredential(id, diddocument) !== undefined;
  };

  const getUrlFromService = (service: string, value: string): string => {
    if (service === 'twitter') return `https://twitter.com/${value}`;
    if (service === 'linkedin') return `https://linkedin.com/in/${value}`;
    if (service === 'facebook') return `https://facebook.com/${value}`;
    if (service === 'google') return `mailto://${value}`;
    return '';
  };

  const parseValueFromService = (service: string, value: string): string => {
    if (service === 'twitter')
      return value.startsWith('@') ? value : `@${value}`;
    if (service === 'linkedin') return `linkedin.com/in/${value}`;
    if (service === 'facebook') return `facebook.com/${value}`;
    if (service === 'google') return `${value}`;
    return '';
  };

  const removeVc = async (key: string) => {
    let userSession = UserService.GetUserSession();
    let documentState = await DidDocumentService.getUserDocument(userSession!);
    let keyIndex = -1;
    documentState.diddocument['verifiableCredential'].forEach(
      (element: any, index: number) => {
        if (`${element['id']}`.endsWith(`#${key.toLowerCase()}`)) {
          keyIndex = index;
        }
      }
    );

    if (keyIndex >= 0) {
      documentState.diddocument['verifiableCredential'].splice(keyIndex, 1);
      DidDocumentService.updateUserDocument(documentState.diddocument);
    }

    // ===== temporary codes start =====
    let newLoginCred = userSession!.loginCred;
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
    }
    const newUserSession = {
      ...userSession,
      loginCred: newLoginCred
    } as ISessionItem;
    await UserService.updateSession(newUserSession);
    // ===== temporary codes end =====
  };

  const createIonItem = (key: string, icon: any) => {
    let vc = getVerifiedCredential(key, diddocument);
    if (!vc) return;
    return (
      <ProfileItem className={style['social-profile-item']}>
        <div className="left">
          <img alt="icon" src={icon} height={40} />
          {vc.isVerified && (
            <img
              alt="shield icon"
              src={shieldIcon}
              className={style['social-profile-badge']}
              height={15}
            />
          )}
        </div>
        <div className="right">
          <p className={style['social-profile-network']}>
            {key.replace(/^./, key[0].toUpperCase())}
          </p>
          {(key === 'facebook' || key === 'linkedin') && (
            <span className={style['social-profile-id']}>
              {parseValueFromService(key, vc.value)}
            </span>
          )}
          {(key === 'google' || key === 'twitter') && (
            <a
              href={getUrlFromService(key, vc.value)}
              target="_blank"
              rel="noopener noreferrer"
              className={style['social-profile-id']}
            >
              {parseValueFromService(key, vc.value)}
            </a>
          )}
        </div>
      </ProfileItem>
    );
  };

  const createModalIonItem = (key: string, icon: any) => {
    let vc = getVerifiedCredential(key, diddocument);
    let header = 'Google Account';
    if (key === 'twitter') header = 'Twitter Account';
    if (key === 'facebook') header = 'Facebook Account';
    if (key === 'linkedin') header = 'LinkedIn Account';

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
          {parseValueFromService(key, vc.value)}
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

  const googleModalItem = () => {
    return createModalIonItem('google', googleIcon);
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

  // const anyCredential = (): boolean => {
  //   if (!diddocument || !diddocument["id"]) return false
  //   let vcs: string[] = diddocument["verifiableCredential"].map((vc: any) => {
  //     return `${vc["id"]}`.replace("#", "")
  //   })
  //   if (!vcs || vcs.length === 0) return false;

  //   return vcs.includes("twitter") ||
  //          vcs.includes("linkedin") ||
  //          vcs.includes("google") ||
  //          vcs.includes("linkedin")
  // }

  // const renderControl = () =>{
  //   let anycredential = anyCredential();
  //   if (anycredential) return <IonCard className={style['social-profile']}>
  //           <IonCardHeader>
  //             <IonCardTitle className={style['card-title']}>
  //               Social Profiles <span className={style['card-link']}>Manage Links</span>
  //             </IonCardTitle>
  //           </IonCardHeader>
  //           <IonCardContent>
  //             <IonList>
  //               {linkedInItem()}
  //               {twitterItem()}
  //               {googleItem()}
  //               {facebookItem()}

  //             </IonList>
  //           </IonCardContent>
  //         </IonCard>

  //   return <div></div>
  // }

  return (
    <div>
      <IonCard className={style['social-profile']}>
        <IonCardHeader>
          <IonCardTitle className={style['card-title']}>
            Social Profiles
            {showManageButton && (
              <span
                className={style['card-link']}
                onClick={() => {
                  setIsManagerOpen(true);
                }}
              >
                Manage Profiles
              </span>
            )}
          </IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          <IonGrid>
            <IonRow>
              {containsVerifiedCredential('linkedin') && (
                <IonCol size="6">{linkedInItem()}</IonCol>
              )}
              {containsVerifiedCredential('twitter') && (
                <IonCol size="6">{twitterItem()}</IonCol>
              )}
              {containsVerifiedCredential('facebook') && (
                <IonCol size="6">{facebookItem()}</IonCol>
              )}
              {containsVerifiedCredential('google') && (
                <IonCol size="6">{googleItem()}</IonCol>
              )}
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>

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
    </div>
  );
};

export default SocialProfilesCard;
