import React from 'react';
import { IonCard, IonCardContent, IonRow, IonImg, IonText } from '@ionic/react';
import style from './style.module.scss';
import { StyledButton } from 'src/elements/buttons';
import Spaces from 'src/assets/messages/NoMessages.png';

interface Props {
  session: ISessionItem;
  openForm: () => void;
}

const MessagesCard: React.FC<Props> = ({ session, openForm }: Props) => {
  return (
    <>
      <IonCard className={style['no-message-card']}>
        <IonCardContent className={style['card-content']}>
          <IonRow>
            <IonImg src={Spaces}></IonImg>
          </IonRow>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default MessagesCard;
