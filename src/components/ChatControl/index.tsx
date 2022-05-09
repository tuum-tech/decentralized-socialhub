import React, { useState } from 'react';
import {
  IonCard,
  IonCardContent,
  IonRow,
  IonImg,
  IonText,
  IonCardHeader,
  IonCol,
  IonInput,
  IonList,
  IonItem,
  IonPopover
} from '@ionic/react';
import style from './style.module.scss';
import { StyledButton } from 'src/elements/buttons';
import Spaces from 'src/assets/messages/NoMessages.png';
import { StringifyOptions } from 'querystring';

interface Props {
  session: ISessionItem;
  roomId: string;
  title: string;
  avatar: string;
  isDirectChat: boolean;
  messages: IChatMessage[];
}

export interface IChatMessage {
  avatar: string;
  message: string;
  did: string;
  username: string;
  messageTime: string;
}

const ChatControl: React.FC<Props> = ({
  session,
  roomId,
  title,
  avatar,
  isDirectChat = true,
  messages
}: Props) => {
  const [showPopover, setShowPopover] = useState(false);
  const [messageToSend, setMessageToSend] = useState('');

  const emojiList = () => {
    let emojis = [
      '😀',
      '😃',
      '😄',
      '😁',
      '😆',
      '😅',
      '🤣',
      '😂',
      '🙂',
      '🙃',
      '😉',
      '😊',
      '😇',
      '🥰',
      '😍',
      '🤩',
      '😘',
      '😗',
      '😋',
      '😚',
      '😜',
      '🤪',
      '😝',
      '🤑',
      '🤗',
      '🤭',
      '🤫',
      '🤔',
      '🤨',
      '🙄'
    ];

    return (
      <>
        <IonRow className={style['message-emojis-list']}>
          {emojis.map(emoji => {
            return emojiItem(emoji);
          })}
        </IonRow>
      </>
    );
  };

  const emojiItem = (emoji: string) => {
    return (
      <IonCol
        className={style['message-emojis-item']}
        size="1"
        onClick={e => {
          setMessageToSend(messageToSend + emoji);
        }}
      >
        {emoji}
      </IonCol>
    );
  };

  const getMessages = () => {
    if (!messages || messages.length <= 0) return <></>;

    return (
      <>
        {' '}
        {messages.map(messageItem => {
          let itemClass = `${isDirectChat ? 'direct' : 'group'}-${
            messageItem.did === session.did ? 'user' : 'friend'
          }`;
          return (
            <IonItem lines="none">
              <div className={style['teste']}>
                <div className={style['message-item-' + itemClass]}>
                  {messageItem.message}
                </div>

                <div>
                  <small className={style['`message-time-' + itemClass]}>
                    {messageItem.messageTime}
                  </small>
                </div>
              </div>
            </IonItem>
          );
        })}
      </>
    );
  };

  return (
    <>
      <IonCard className={style['message-chat-card']}>
        <IonCardHeader className={style['message-chat-card-header']}>
          {title}
        </IonCardHeader>

        <IonCardContent className={style['message-chat-card-content']}>
          <IonList className={style['message-list']}>{getMessages()}</IonList>
        </IonCardContent>

        <IonRow className={style['card-footer']}>
          <IonCol size="11">
            <IonInput
              value={messageToSend}
              onIonChange={e => setMessageToSend(e.detail.value as string)}
              placeholder="Type your message"
            ></IonInput>
          </IonCol>

          <IonCol
            size="1"
            class="ion-text-center ion-justify-content-center"
            className={style['align-text-middle']}
          >
            <a onClick={() => setShowPopover(true)}>&#128512;</a>
            <IonPopover
              isOpen={showPopover}
              onDidDismiss={e => setShowPopover(false)}
            >
              {emojiList()}
            </IonPopover>
          </IonCol>
        </IonRow>
      </IonCard>
    </>
  );
};

export default ChatControl;
