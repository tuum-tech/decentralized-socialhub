import React from 'react';
import { IonRow, IonCol, IonCardTitle } from '@ionic/react';
import {
  CardOverview,
  CardHeaderContent,
  CardContentContainer
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../common';

import icon_linkedin from 'src/assets/icon/Linkedin.svg';
import icon_twitter from 'src/assets/icon/Twitter.svg';
import icon_facebook from 'src/assets/icon/Facebook.svg';
import icon_google from 'src/assets/icon/Google.svg';
import icon_github from 'src/assets/icon/Github.svg';
import icon_discord from 'src/assets/icon/Discord.svg';
import icon_shield from 'src/assets/icon/shield.svg';
import style from './style.module.scss';

interface IProps {
  template?: string;
  space: any;
}

const Links: React.FC<IProps> = ({ template = 'default', space }: IProps) => {
  const links = space.socialLinks || {};
  return (
    <CardOverview template={template}>
      <CardHeaderContent>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>Links</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan style={{ opacity: 0.5 }}>View all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeaderContent>
      <CardContentContainer>
        <IonRow>
          {links['linkedin'] && (
            <IonCol className={style.link} size="12">
              <div className={style.logo}>
                <img src={icon_linkedin} alt="linkedin icon" />
                <img src={icon_shield} alt="shield icon" />
              </div>
              <div className={style.name}>
                <h1>Linkedin</h1>
                <h2>{links['linkedin']}</h2>
              </div>
            </IonCol>
          )}
          {links['twitter'] && (
            <IonCol className={style.link} size="12">
              <div className={style.logo}>
                <img src={icon_twitter} alt="twitter icon" />
                <img src={icon_shield} alt="shield icon" />
              </div>
              <div className={style.name}>
                <h1>Twitter</h1>
                <h2>{links['twitter']}</h2>
              </div>
            </IonCol>
          )}
          {links['facebook'] && (
            <IonCol className={style.link} size="12">
              <div className={style.logo}>
                <img src={icon_facebook} alt="facebook icon" />
                <img src={icon_shield} alt="shield icon" />
              </div>
              <div className={style.name}>
                <h1>Facebook</h1>
                <h2>{links['facebook']}</h2>
              </div>
            </IonCol>
          )}
          {links['google'] && (
            <IonCol className={style.link} size="12">
              <div className={style.logo}>
                <img src={icon_google} alt="google icon" />
                <img src={icon_shield} alt="shield icon" />
              </div>
              <div className={style.name}>
                <h1>Google</h1>
                <h2>{links['google']}</h2>
              </div>
            </IonCol>
          )}
          {links['github'] && (
            <IonCol className={style.link} size="12">
              <div className={style.logo}>
                <img src={icon_github} alt="github icon" />
                <img src={icon_shield} alt="shield icon" />
              </div>
              <div className={style.name}>
                <h1>Google</h1>
                <h2>{links['github']}</h2>
              </div>
            </IonCol>
          )}
          {links['discord'] && (
            <IonCol className={style.link} size="12">
              <div className={style.logo}>
                <img src={icon_discord} alt="discord icon" />
                <img src={icon_shield} alt="shield icon" />
              </div>
              <div className={style.name}>
                <h1>Google</h1>
                <h2>{links['discord']}</h2>
              </div>
            </IonCol>
          )}
        </IonRow>
      </CardContentContainer>
    </CardOverview>
  );
};

export default Links;
