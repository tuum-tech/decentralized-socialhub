import React from 'react';
import { IonCard, IonCardContent, IonRow, IonImg, IonText } from '@ionic/react';
import style from './style.module.scss';
import { StyledButton } from 'src/elements/buttons';
import Spaces from 'src/assets/messages/NoMessages.png';

interface Props {
  session: ISessionItem;
  openForm: () => void;
}

const NoMessageCard: React.FC<Props> = ({ session, openForm }: Props) => {
  return (
    <>
      <IonCard className={style['no-message-card']}>
        <IonCardContent className={style['card-content']}>
          <IonRow>
            <IonImg src={Spaces}></IonImg>
          </IonRow>
          <IonRow>
            <IonText>
              <h3>No Messages Yet</h3>
            </IonText>
          </IonRow>
          <IonRow>
            <IonText>
              <h4>You don't have any messages.</h4>
            </IonText>
          </IonRow>
          <IonRow>
            <StyledButton width="200px" height="40px" onClick={openForm}>
              Start a new conversation
            </StyledButton>
          </IonRow>
        </IonCardContent>
      </IonCard>
    </>
  );
};

export default NoMessageCard;
