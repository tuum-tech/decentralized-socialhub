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
  IonSearchbar
} from '@ionic/react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { PageProps } from './types';

import style from './style.module.scss';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import { SubState } from 'src/store/users/types';

import { createClient, EventTimeline, MatrixClient, Room } from 'matrix-js-sdk';
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

interface IRoomItem {
  roomId: string;
  name: string;
  avatar: string;
  messages: IChatMessage[];
  unreadMessages: number;
}

interface IRooms {
  [roomId: string]: IRoomItem;
}

const ChatPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [selectedRoom, setSelectedRoom] = useState<string>('');
  const [client, setClient] = useState<MatrixClient>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>('');

  const [rooms, setRooms] = useState<IRooms>({});
  const [roomsIds, setRoomsIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  let did = getDIDString(props.match.params.did, false);

  const getUserProfile = async (did: string) => {
    let searchServiceLocal: SearchService;
    searchServiceLocal = await SearchService.getSearchServiceAppOnlyInstance();
    let listUsers: any = await searchServiceLocal.getUsersByDIDs(
      [`did:elastos:${did}`],
      200,
      0
    );
    let usersFound = listUsers?.response?.get_users_by_dids?.items || [];
    console.log('DID search', `did:elastos:${did}`);
    console.log('users found', usersFound);
    return usersFound[0];
  };

  const handleAddFriendChat = async (friend: string) => {
    if (!isConnected) return;

    let friendId = `@${getDIDString(
      friend,
      true
    ).toLowerCase()}:my.matrix.host`;
    console.log('friend id', friendId);
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
      avatar: '',
      messages: []
    };

    roomsIds.push(room.room_id);

    setRooms(rooms);
    setRoomsIds([...roomsIds]);
    setSelectedRoom(room.room_id);
    setIsModalOpen(false);
  };

  const search = (newValue: string) => {
    setSearchQuery(newValue);
  };

  useEffect(() => {
    (async () => {
      let localUserId = `${getDIDString(props.session.did, true)}`;
      setUserId(localUserId);

      let localClient = createClient(
        process.env.REACT_APP_SYNAPSE_SERVER || ''
      );
      await localClient.login('m.login.password', {
        user: localUserId,
        password: 'abc123'
      });
      await localClient.startClient({});

      // rooms[selectedRoom] = {
      //   roomId: selectedRoom,
      //   name: "Teste",
      //   unreadMessages: 0,
      //   avatar: "",
      //   messages: [{
      //     avatar: '',
      //     did: props.session.did,
      //     message: 'first message',
      //     username: props.session.name,
      //     messageTime: '5:40 PM'
      //   }, {
      //     avatar: '',
      //     did: 'otherDID',
      //     message: 'first response',
      //     username: 'friend name',
      //     messageTime: '5:41 PM'
      //   }]
      // }

      localClient.once('sync', async (state, prevstate, res) => {
        if (state === 'PREPARED') {
          console.log('set user id', localClient.getUserId());
          setIsConnected(true);

          // // find invited direct message rooms
          const userRooms = localClient.getRooms();
          console.log('chat rooms', userRooms);

          for (const r of userRooms) {
            await addRoom(r);
            //await localClient.leave(r.roomId)
          }

          // const invitedDMRooms = rooms.filter(room => {
          //   //getMyMembership -> "invite", "join", "leave", "ban"

          //   return membership === 'invite' && type === 'directMessage';
          // });

          // // join the first invited DM room
          // localClient.joinRoom()

          // // leave the second invited DM room
          // localClient.leave(invitedDMRooms[1].roomId).then(...).catch(...)
        }
      });

      localClient.on('Room.timeline', (evnt, room, toStartOfTimeline) => {
        console.log('Room timeline event', evnt);
        console.log('Room timeline room', room);
        console.log('Room timeline toStartOfTimeline', toStartOfTimeline);
        if (evnt.getType() !== 'm.room.nessage') return;
      });

      localClient.on('Room', async room => {
        console.log('Room', room);
        await addRoom(room);
      });

      setClient(localClient);
      setIsConnected(true);
    })();
  }, [addRoom, props.session, userId]);

  const getDidFromId = (matrixId: string): string => {
    let indexEnd = matrixId.lastIndexOf(':');
    return `${matrixId.substring(1, indexEnd)}`;
  };

  const addRoom = async (r: Room) => {
    if (roomsIds.indexOf(r.roomId) >= 0) return;

    let myID = `@${getDIDString(
      props.session.did,
      true
    ).toLowerCase()}:my.matrix.host`;
    let membership = r.getMyMembership();
    let isDM = r.getDMInviter() || false;

    if (isDM || !membership) {
      if (membership === 'invite') {
        await client!.joinRoom(r.roomId);
      }

      let userName = '';
      let avatar = '';

      for (let member of r.currentState.getMembers()) {
        if (member.userId !== myID) {
          let userDid = getDidFromId(member.userId);
          let userProfile = await getUserProfile(userDid);
          console.log('userProfile', userProfile);
        }
      }

      rooms[r.roomId] = {
        roomId: r.roomId,
        name: 'Ainda nao sei',
        unreadMessages: 0,
        avatar: '',
        messages: []
      };

      roomsIds.push(r.roomId);

      setRooms(rooms);
      setRoomsIds([...roomsIds]);
    }
  };

  const getFriendsList = () => {
    if (roomsIds.length <= 0) return <></>;
    //lines="none"
    return (
      <>
        {' '}
        {roomsIds.map(roomId => (
          <IonItem
            key={roomId}
            lines="none"
            className={style['messages-friendlist-item']}
          >
            <p>{rooms[roomId].name}</p>
            <small>last message</small>
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
                            size="3"
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
                          </IonCol>
                          <IonCol size="9">
                            {rooms[selectedRoom] && (
                              <ChatControl
                                avatar={rooms[selectedRoom].avatar}
                                roomId={rooms[selectedRoom].roomId}
                                session={props.session}
                                title={rooms[selectedRoom].name}
                                messages={rooms[selectedRoom].messages}
                                isDirectChat={true}
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
