import React from 'react';
import {
  IonRow,
  IonCol,
  IonCardTitle
} from '@ionic/react';
import {
  CardOverview,
  CardHeader,
  CardContent
} from 'src/components/cards/common';
import { LinkStyleSpan } from '../common';

import icon_linkedin from 'src/assets/icon/Linkedin.svg';
import icon_twitter from 'src/assets/icon/Twitter.svg';
import icon_facebook from 'src/assets/icon/Facebook.svg';
import icon_google from 'src/assets/icon/Google.svg';
import icon_shield from 'src/assets/icon/shield.svg';
import style from './style.module.scss';

interface IProps {
  template?: string;
}

const Follower: React.FC<IProps> = ({ template = 'default' }: IProps) => {
  return (
    <CardOverview template={template}>
      <CardHeader>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>Links</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan>View all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeader>
      <CardContent>
        <IonRow>
          <IonCol className={style.link} size="6">
            <div className={style.logo}>
              <img src={icon_linkedin} />
              <img src={icon_shield} />
            </div>
            <div className={style.name}>
              <h1>Linkedin</h1>
              <h2>@akeywood</h2>
            </div>
          </IonCol>
          <IonCol className={style.link} size="6">
            <div className={style.logo}>
              <img src={icon_twitter} />
              <img src={icon_shield} />
            </div>
            <div className={style.name}>
              <h1>Twitter</h1>
              <h2>@kpwood</h2>
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol className={style.link} size="6">
            <div className={style.logo}>
              <img src={icon_facebook} />
              <img src={icon_shield} />
            </div>
            <div className={style.name}>
              <h1>Facebook</h1>
              <h2>@akeywood</h2>
            </div>
          </IonCol>
          <IonCol className={style.link} size="6">
            <div className={style.logo}>
              <img src={icon_google} />
              <img src={icon_shield} />
            </div>
            <div className={style.name}>
              <h1>Google</h1>
              <h2>@kpwood</h2>
            </div>
          </IonCol>
        </IonRow>
      </CardContent>
    </CardOverview>
  );
};

export default Follower;
