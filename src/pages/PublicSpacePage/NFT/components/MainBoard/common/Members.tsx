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
import nft_item_icon from 'src/assets/space/nft_item.jpg';
import welcome_badge from 'src/assets/space/welcome_badge.svg';
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
            <IonCardTitle>Members (10K)</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan>View all</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeader>
      <CardContent>
        <IonRow className={style['row']}>
          <div className={style['avatar']}>
            <img src={nft_item_icon} />
            <img src={welcome_badge} />
          </div>
          <span className={style['name']}>Ronald Richards</span>
        </IonRow>
        <IonRow className={style['row']}>
          <div className={style['avatar']}>
            <img src={nft_item_icon} />
            <img src={welcome_badge} />
          </div>
          <span className={style['name']}>Ronald Richards</span>
        </IonRow>
        <IonRow className={style['row']}>
          <div className={style['avatar']}>
            <img src={nft_item_icon} />
            <img src={welcome_badge} />
          </div>
          <span className={style['name']}>Ronald Richards</span>
        </IonRow>
      </CardContent>
    </CardOverview>
  );
};

export default Follower;
