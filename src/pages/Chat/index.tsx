import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonModal,
  IonList,
  IonItem,
  IonCard,
  IonCardContent,
  IonSearchbar,
  IonBadge
} from '@ionic/react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { PageProps } from './types';

import style from './style.module.scss';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import { SubState } from 'src/store/users/types';

import {
  createClient as createClientMatrix,
  EventTimeline,
  MatrixClient,
  Room
} from 'matrix-js-sdk';
import styled from 'styled-components';
import NoMessageCard from './components/NoMessagesCard';
import SearchFriendForm from './components/SearchFriendForm';
import { getDIDString } from 'src/utils/did';
import PageLoading from 'src/elements/LoadingIndicator';
import ChatControl from '../../components/ChatControl/index';
import { IChatMessage } from '../../components/ChatControl/index';
import { UserService } from '../../services/user.service';
import { DidDocumentService } from '../../services/diddocument.service';
import { SearchService } from 'src/services/search.service';
import { DID } from '@elastosfoundation/did-js-sdk';
import { Guid } from 'guid-typescript';

import Avatar from '../../components/Avatar';
import messages from '../ChooseVaultPage/messages';
import moment from 'moment';
import { eventNames } from 'process';
import { ChatService } from '../../services/chat.service';
import { StyledButton } from 'src/elements/buttons';

interface IRoomItem {
  roomId: string;
  name: string;
  did: string;
  messages: IChatMessage[];
  unreadMessages: number;
  lastMessageTs: string;
  isEnabled: boolean;
}

interface IRooms {
  [roomId: string]: IRoomItem;
}

const ChatPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  const CustomModal = styled(IonModal)`
    --height: 740px;
    --border-radius: 16px;
  `;

  const Header = styled.div`
    width: 100%;
    height: 83px;
    background: #fff;
    padding: 10px 48px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
  const ContentDiv = styled.div`
    padding: 40px 25px 0px 25px;
  `;

  const PageTitle = styled.h2`
    font-family: 'SF Pro Display';
    font-size: 28px;
    font-weight: 600;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.36;
    letter-spacing: normal;
    text-align: left;
    color: #27272e;
    margin-bottom: 0px;
  `;

  const [userId] = useState<string>(
    `@${getDIDString(props.session.did, true).toLowerCase()}:${
      process.env.REACT_APP_SYNAPSE_SERVERNAME
    }`
  );

  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [client, setClient] = useState<MatrixClient>(createClientMatrix(''));
  const [isConnected, setIsConnected] = useState<boolean>(false);

  const [rooms, setRooms] = useState<IRooms>({});
  const [roomsIds, setRoomsIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getUserProfile = async (did: string) => {
    let searchServiceLocal: SearchService;
    searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let listUsers: any = await searchServiceLocal.getUserByDID(
      `did:elastos:${did}`
    );
    let usersFound = listUsers?.response?.get_users_by_did?.items || [];
    return usersFound[0];
  };

  const handleAddFriendChat = async (friend: string) => {
    if (!isConnected) return;

    let friendId = `@${getDIDString(friend, true).toLowerCase()}:${
      process.env.REACT_APP_SYNAPSE_SERVERNAME
    }`;
    let friendProfile = await getUserProfile(friend);

    let room = await client!.createRoom({
      preset: 'trusted_private_chat',
      invite: [friendId],
      is_direct: true
    });

    rooms[room.room_id] = {
      roomId: room.room_id,
      name: friendProfile.name,
      unreadMessages: 0,
      did: friend,
      messages: [],
      lastMessageTs: '0',
      isEnabled: true
    };

    roomsIds.push(room.room_id);

    setIsModalOpen(false);
    setRooms(rooms);
    setRoomsIds(roomsIds);
    setSelectedRoom(room.room_id);
  };

  const search = (newValue: string) => {
    setSearchQuery(newValue);
  };

  const leaveRoom = async (roomId: string) => {
    try {
      await client!.leave(roomId);

      delete rooms[roomId];

      let indexRoom = roomsIds.indexOf(roomId);

      setRooms(rooms);
      setRoomsIds(roomsIds.splice(indexRoom));
      setSelectedRoom(roomsIds.length === 0 ? '' : roomsIds[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const getMessages = (): IChatMessage[] => {
    if (selectedRoom === '' || rooms[selectedRoom] === undefined) return [];

    return rooms[selectedRoom].messages;
  };

  const addRoom = async (r: Room) => {
    if (roomsIds.indexOf(r.roomId) >= 0) return;

    let membership = r.getMyMembership();
    let isDM = r.getDMInviter() || false;

    if (isDM || membership !== undefined) {
      if (membership === 'invite') {
        await client!.joinRoom(r.roomId);
      }
      let userDid = '';
      let userName = '';
      let avatar = '';

      for (let member of r.currentState.getMembers()) {
        if (member.userId !== userId) {
          userDid = getDidFromId(member.userId);
          let userProfile = await getUserProfile(userDid);
          userName = userProfile.name;
          avatar = `did:elastos:${userDid}`;
        }
      }

      var messages: IChatMessage[] = [];
      var lastMessageTs = '';
      var isEnabled = true;
      r.timeline.forEach(evnt => {
        if (evnt.getType() === 'm.room.message') {
          lastMessageTs = evnt.getTs().toString();
          messages.push({
            messageKey: Guid.create().toString(),
            avatar: '',
            did: `did:elastos:${getDidFromId(evnt.event.sender)}`,
            message: evnt.event.content.body,
            username: userName,
            messageTime: (evnt as any).localTimestamp
          });
        }

        if (evnt.getType() === 'm.room.member') {
          console.log('Event member', evnt);
          let content: any = evnt.event.content;
          if (content.membership === 'leave') {
            isEnabled = false;
            messages.push({
              messageKey: Guid.create().toString(),
              avatar: '',
              did: '',
              message: userName + ' left this channel',
              username: userName,
              messageTime: (evnt as any).localTimestamp
            });
          }
        }
      });

      rooms[r.roomId] = {
        roomId: r.roomId,
        name: userName,
        unreadMessages: 0,
        did: avatar,
        messages: messages,
        lastMessageTs,
        isEnabled
      };

      if (roomsIds.indexOf(r.roomId) < 0) roomsIds.push(r.roomId);

      setRooms(rooms);
      setRoomsIds([...roomsIds]);
      if (roomsIds.length === 1) setSelectedRoom(roomsIds[0]);
    }
  };

  useEffect(() => {
    (async () => {
      if (isConnected) return;

      let accessToken = await ChatService.Authentication(props.session.did);

      let client = createClientMatrix({
        baseUrl: process.env.REACT_APP_SYNAPSE_SERVER || '',
        accessToken: accessToken,
        userId: userId
      });

      await client.startClient({});

      client.once('sync', async (state, prevstate, res) => {
        if (state === 'PREPARED') {
          setIsConnected(true);

          const userRooms = client.getRooms();

          for (const r of userRooms) {
            if (roomsIds.indexOf(r.roomId) >= 0) continue;
            await addRoom(r);
          }
        }
      });

      client.on('Room.timeline', (evnt, room, toStartOfTimeline) => {
        if (
          evnt.getType() !== 'm.room.member' &&
          evnt.getType() !== 'm.room.message'
        )
          return;
        if (rooms[room.roomId] == undefined) return;

        if (evnt.getType() === 'm.room.member') {
          if (evnt.event.content.membership === 'leave') {
            rooms[room.roomId].messages.push({
              messageKey: Guid.create().toString(),
              avatar: '',
              did: '',
              message: rooms[room.roomId].name + ' left this channel',
              username: rooms[room.roomId].name,
              messageTime: evnt.localTimestamp
            });

            rooms[room.roomId].isEnabled = false;
          }
        } else if (evnt.getType() === 'm.room.message') {
          rooms[room.roomId].messages.push({
            messageKey: Guid.create().toString(),
            avatar: '',
            did: `did:elastos:${getDidFromId(evnt.event.sender)}`,
            message: evnt.event.content.body,
            username: rooms[room.roomId].name,
            messageTime: evnt.localTimestamp
          });
        }

        if (selectedRoom !== room.roomId) rooms[room.roomId].unreadMessages++;
        rooms[room.roomId].lastMessageTs = evnt.localTimestamp;

        setRooms({ ...rooms });
      });

      client.on('Room', async room => {
        await addRoom(room);
      });

      setClient(client);
      setIsConnected(true);
    })();
  }, [
    addRoom,
    isConnected,
    props.session,
    rooms,
    roomsIds,
    selectedRoom,
    userId
  ]);

  const getDidFromId = (matrixId: string): string => {
    let indexEnd = matrixId.lastIndexOf(':');
    return `${matrixId.substring(1, indexEnd)}`;
  };

  const sendMessage = (message: string, roomId: string) => {
    var content = {
      body: message,
      msgtype: 'm.text'
    };
    client.sendEvent(roomId, 'm.room.message', content, '');
  };

  const getLastMessage = (room: IRoomItem): string => {
    if (
      room === undefined ||
      room.messages === undefined ||
      room.messages.length === 0
    )
      return 'No messages yet.';
    let messageItem = room.messages.slice(-1)[0];

    return messageItem.message.length > 40
      ? messageItem.message.substring(0, 40) + '...'
      : messageItem.message;
  };

  const getFriendsList = () => {
    if (roomsIds.length <= 0) return <></>;

    return (
      <>
        {' '}
        {roomsIds.map(roomId => (
          <IonItem
            key={roomId}
            lines="none"
            onClick={e => {
              if (roomId === selectedRoom) return;
              rooms[roomId].unreadMessages = 0;
              setRooms({ ...rooms });
              setSelectedRoom(roomId);
            }}
            className={
              style[
                `messages-friendlist-item${
                  roomId === selectedRoom ? '-selected' : ''
                }`
              ]
            }
          >
            <Avatar
              did={rooms[roomId].did}
              width="100"
              noBorder={true}
            ></Avatar>

            <p>
              <span className={style[`messages-friendlist-item-header`]}>
                {rooms[roomId].name}
              </span>
              <br />
              <small>{getLastMessage(rooms[roomId])}</small>
            </p>

            <small className={style[`messages-friendlist-item-time`]}>
              {rooms[roomId].lastMessageTs === ''
                ? 'Never'
                : moment(Number(rooms[roomId].lastMessageTs)).fromNow()}
            </small>
          </IonItem>
        ))}
      </>
    );
  };
  return (
    <>
      <IonPage className={style['messagespage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <PageTitle>Messages</PageTitle>
                </Header>
                <ContentDiv>
                  {!isConnected && (
                    <PageLoading loadingText="Connecting message service"></PageLoading>
                  )}

                  {isConnected && roomsIds && roomsIds.length === 0 && (
                    <NoMessageCard
                      session={props.session}
                      openForm={() => setIsModalOpen(true)}
                    ></NoMessageCard>
                  )}

                  {isConnected && roomsIds && roomsIds.length > 0 && (
                    <IonCard className={style['messages-card']}>
                      <IonCardContent
                        className={style['messages-card-content']}
                      >
                        <IonRow>
                          <IonCol
                            size="4"
                            className={style['messages-card-list']}
                          >
                            <IonRow>
                              <IonCol>
                                <IonSearchbar
                                  value={searchQuery}
                                  onIonChange={e =>
                                    search(e.detail.value || '')
                                  }
                                  placeholder="Search username or DID"
                                  className={style['search-input']}
                                ></IonSearchbar>
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol>
                                <IonList>{getFriendsList()}</IonList>
                              </IonCol>
                            </IonRow>
                            <IonRow>
                              <IonCol>
                                <StyledButton
                                  width="200px"
                                  height="40px"
                                  onClick={() => setIsModalOpen(true)}
                                >
                                  Add new friend
                                </StyledButton>
                              </IonCol>
                            </IonRow>
                          </IonCol>
                          <IonCol size="8">
                            {rooms[selectedRoom] && (
                              <ChatControl
                                onLeaveRoom={leaveRoom}
                                did={rooms[selectedRoom].did}
                                roomId={rooms[selectedRoom].roomId}
                                session={props.session}
                                title={rooms[selectedRoom].name}
                                messages={getMessages()}
                                isDirectChat={true}
                                onSendMessage={sendMessage}
                                isEnabled={rooms[selectedRoom].isEnabled}
                              ></ChatControl>
                            )}

                            {!rooms[selectedRoom] && (
                              <p>Room not found {selectedRoom}</p>
                            )}
                          </IonCol>
                        </IonRow>
                      </IonCardContent>
                    </IonCard>
                  )}
                </ContentDiv>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
      <CustomModal
        onDidDismiss={() => {
          setIsModalOpen(false);
        }}
        isOpen={isModalOpen}
        cssClass="my-custom-class"
      >
        <SearchFriendForm
          session={props.session}
          onClose={() => {
            setIsModalOpen(false);
          }}
          selectFriend={friend => {
            handleAddFriendChat(friend);
          }}
        ></SearchFriendForm>
      </CustomModal>
    </>
  );
};

export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  session: makeSelectSession()
});

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatPage);
