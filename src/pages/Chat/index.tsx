import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonModal
} from '@ionic/react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import {
  PageProps,
  Header,
  HeaderInfo,
  PageTitle,
  PageSubtitle,
  Content
} from './types';

import style from './style.module.scss';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import { SubState } from 'src/store/users/types';

import { createClient, EventTimeline, MatrixClient } from 'matrix-js-sdk';
import styled from 'styled-components';
import NoMessageCard from './components/NoMessagesCard';
import SearchFriendForm from './components/SearchFriendForm';

const ChatPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  const [accessToken, setAccessToken] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [messages, setMessages] = useState<EventTimeline[]>([]);

  const [client, setClient] = useState<MatrixClient | null>();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getDIDString = (did: string, isLink = true) => {
    if (did && did !== '') {
      if (isLink) {
        return did.replaceAll('did:elastos:', '');
      }
      if (did.startsWith('did:elastos:')) return did;
      return 'did:elastos:' + did;
    }
    return did;
  };

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

  const handleAddFriendChat = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    (async () => {
      setUserId(`${getDIDString(props.session.did, true)}:DellXPS`);
      setRoomId(
        `${getDIDString(props.session.did, true)}_${getDIDString(
          props.match.params.did,
          true
        )}`
      );
      let client = createClient(process.env.REACT_APP_SYNAPSE_SERVER || '');
      await client.login('m.login.password', {
        user: userId,
        password: 'abc123'
      });
      await client.startClient({});

      client.once('sync', (state, prevstate, res) => {
        console.log('Sync client');
      });

      client.on('Room.timeline', (evnt, room, toStartOfTimeline) => {
        if (evnt.getType() !== 'm.room.nessage') return;
      });

      setClient(client);
      setIsConnected(true);
    })();
  }, [props.match.params.did, props.session, userId]);
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
                  <NoMessageCard
                    session={props.session}
                    openForm={() => setIsModalOpen(true)}
                  ></NoMessageCard>
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
          selectFriend={friend => {}}
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
