import React from 'react';
import { IonCard, IonCardContent, IonRow, IonImg, IonText } from '@ionic/react';
import style from './style.module.scss';

interface Props {
  session: ISessionItem;
  openForm: () => void;
}

const MatrixChat: React.FC<Props> = ({ session, openForm }: Props) => {
  return (
    <>
      <IonCard className={style['no-message-card']}>
        <IonCardContent className={style['card-content']}>
          <IonRow></IonRow>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default MatrixChat;
