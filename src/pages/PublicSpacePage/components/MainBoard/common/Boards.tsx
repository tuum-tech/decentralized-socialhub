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
import style from './style.module.scss';

interface IProps {
  template?: string;
}

const Boards: React.FC<IProps> = ({ template = 'default' }: IProps) => {
  return (
    <CardOverview template={template}>
      <CardHeader>
        <IonRow className="ion-justify-content-between ion-no-padding">
          <IonCol className="ion-no-padding">
            <IonCardTitle>Boards</IonCardTitle>
          </IonCol>
          <IonCol size="auto" className="ion-no-padding">
            <LinkStyleSpan>Expand</LinkStyleSpan>
          </IonCol>
        </IonRow>
      </CardHeader>
      <CardContent>
        <IonRow className={style['boards']}>
            <span>Chat</span>
        </IonRow>
        <IonRow className={style['boards']}>
            <span>Guidelines</span>
        </IonRow>
        <IonRow className={style['boards']}>
            <span>Greetings</span>
        </IonRow>
        <IonRow className={style['boards']}>
            <span>New Members</span>
        </IonRow>
      </CardContent>
    </CardOverview>
  );
};

export default Boards;
