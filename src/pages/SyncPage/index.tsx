import React, { useEffect, useState } from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonImg
} from '@ionic/react';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import {
  InferMappedProps,
  Header,
  ArrowImage,
  HeaderInfo,
  PageTitle,
  PageSubtitle,
  Content
} from './types';

import style from './style.module.scss';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import arrowLeft from '../../assets/icon/arrow-left-square.svg';
import SyncProgressCard from './components/SyncProgressCard';
import SyncItemsCard from './components/SyncItemsCard';
import { SubState } from 'src/store/users/types';
import { ISyncItem, SyncService, SyncState } from 'src/services/sync.service';

const SyncPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [syncItems, setSyncItems] = useState<ISyncItem[]>([]);

  const updateSyncItem = async (syncItem: ISyncItem) => {
    let index = syncItems.findIndex(local => {
      return local.Label === syncItem.Label;
    });

    syncItems[index].State = syncItem.State;
    setSyncItems([...syncItems]);
  };

  const amountCompleted = () => {
    return syncItems.filter(item => item.State !== SyncState.Waiting).length;
  };

  const onSync = async () => {
    const newSession = await SyncService.UpdateDifferences(
      JSON.parse(JSON.stringify(props.session)),
      syncItems
    );

    //
    eProps.setSession({
      session: newSession
    });

    setTimeout(() => {
      window.location.href = '/profile';
    }, 1000);
  };

  useEffect(() => {
    (async () => {
      try {
        let items = await SyncService.GetSyncDifferences(props.session);
        if (!items) items = [];
        setSyncItems(items);
      } catch (error) {
        console.log(error);
        setSyncItems([]);
      }
    })();
  }, [props.session]);
  return (
    <>
      <IonPage className={style['syncpage']}>
        <IonContent className={style['profilecontent']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <ArrowImage
                    onClick={() => (window.location.href = '/profile')}
                  >
                    <IonImg src={arrowLeft}></IonImg>
                  </ArrowImage>
                  <HeaderInfo>
                    <PageTitle>Profile Manager</PageTitle>
                    <PageSubtitle>Sync Profile</PageSubtitle>
                  </HeaderInfo>
                </Header>
                <Content>
                  <SyncProgressCard
                    totalAmount={syncItems.length}
                    amountCompleted={amountCompleted()}
                    onSync={onSync}
                  ></SyncProgressCard>
                  <SyncItemsCard
                    syncItems={syncItems}
                    updateSyncItem={updateSyncItem}
                  ></SyncItemsCard>
                </Content>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
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

export default connect(mapStateToProps, mapDispatchToProps)(SyncPage);
