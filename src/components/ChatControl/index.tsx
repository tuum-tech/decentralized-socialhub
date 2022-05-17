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

import expand from 'src/assets/space/expand.svg';
import { IonButton } from '@ionic/react';
import moment from 'moment';
import Avatar from '../Avatar';
import { PopoverMenuItem } from '../cards/common';

interface Props {
  session: ISessionItem;
  roomId: string;
  title: string;
  did: string;
  isDirectChat: boolean;
  messages: IChatMessage[];
  isEnabled: boolean;
  onSendMessage: (message: string, roomid: string) => void;
  onLeaveRoom: (roomid: string) => void;
}

export interface IChatMessage {
  messageKey: string;
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
  did,
  isDirectChat = true,
  messages,
  isEnabled,
  onSendMessage,
  onLeaveRoom
}: Props) => {
  const [showPopover, setShowPopover] = useState(false);
  const [messageToSend, setMessageToSend] = useState('');
  const [threeDotPopover, setThreeDotPopover] = useState({
    showPopover: false,
    event: undefined
  });

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
            messageItem.did === ''
              ? 'info'
              : messageItem.did.toLowerCase() === session.did.toLowerCase()
              ? 'user'
              : 'friend'
          }`;

          return (
            <IonItem lines="none" key={messageItem.messageKey}>
              <div className={style['teste']}>
                <div className={style['message-item-' + itemClass]}>
                  {messageItem.message}
                </div>
                <div className={style['message-time-' + itemClass]}>
                  {moment(Number(messageItem.messageTime)).fromNow()}
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
          <Avatar did={did} width="100" noBorder={true}></Avatar>
          <span>{title}</span>
          <IonImg
            id="threeDotButton"
            className={style['message-chat-expand']}
            src={expand}
            onClick={(e: any) => {
              e.persist();
              setThreeDotPopover({ showPopover: true, event: e });
            }}
          ></IonImg>
        </IonCardHeader>

        <IonCardContent className={style['message-chat-card-content']}>
          <IonList className={style['message-list']}>{getMessages()}</IonList>
        </IonCardContent>

        <IonRow className={style['card-footer']}>
          <IonCol size="10">
            <IonInput
              disabled={!isEnabled}
              value={messageToSend}
              onIonChange={e => setMessageToSend(e.detail.value as string)}
              placeholder="Type your message"
            ></IonInput>
          </IonCol>

          <IonCol size="1">
            <IonButton
              disabled={!isEnabled}
              onClick={e => {
                if (!isEnabled || messageToSend.trim().length <= 0) return;
                onSendMessage(messageToSend, roomId);
                setMessageToSend('');
              }}
            >
              Send
            </IonButton>
          </IonCol>

          <IonCol
            size="1"
            class="ion-text-center ion-justify-content-center"
            className={style['align-text-middle']}
          >
            <a
              className={style['message-chat-emoji']}
              onClick={() => {
                if (isEnabled) setShowPopover(true);
              }}
            >
              &#128512;
            </a>
            <IonPopover
              isOpen={showPopover}
              onDidDismiss={e => setShowPopover(false)}
            >
              {emojiList()}
            </IonPopover>

            <div>
              <IonPopover
                showBackdrop={false}
                //cssClass={styleWidget['popover-class']}
                event={threeDotPopover.event}
                isOpen={threeDotPopover.showPopover}
                onDidDismiss={() =>
                  setThreeDotPopover({ showPopover: false, event: undefined })
                }
              >
                <PopoverMenuItem
                  onClick={e => {
                    setThreeDotPopover({
                      showPopover: false,
                      event: undefined
                    });

                    onLeaveRoom(roomId);
                  }}
                >
                  Leave Room
                </PopoverMenuItem>
              </IonPopover>
            </div>
          </IonCol>
        </IonRow>
      </IonCard>
    </>
  );
};

export default ChatControl;
