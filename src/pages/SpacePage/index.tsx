import React, { useEffect, useState, useCallback } from 'react';
import {
  IonContent,
  IonPage,
  IonGrid,
  IonRow,
  IonCol,
  IonModal
} from '@ionic/react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import styled from 'styled-components';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import { UserService } from 'src/services/user.service';
import { DidService } from 'src/services/did.service.new';
import { SpaceService } from 'src/services/space.service';

import SpacePageHeader, {
  Header,
  PageTitle,
  SpaceTabsContainer
} from './components/SpacePageHeader';
import SpaceListView from 'src/components/Space/SpaceListView';
import { InferMappedProps, SubState } from './types';
import style from './style.module.scss';
import { Button } from 'src/elements/buttons';
import CreateSpace from './components/CreateSpace';
import CreateSpaceForm from './components/CreateSpaceForm';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { showNotify } from 'src/utils/notify';

const CustomModal = styled(IonModal)`
  --height: 740px;
  --border-radius: 16px;
`;

const SpacePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const { session } = props;
  const [loadingText, setLoadingText] = useState('');
  const [mySpaces, setMySpaces] = useState<any[]>([]);
  const [followingSpaces, setFollowingSpaces] = useState<any[]>([]);
  const [active, setActive] = useState('my spaces');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setTimerForSpaces = () => {
    const timer = setTimeout(async () => {
      await refreshSpaces();
      setTimerForSpaces();
    }, 1000);
    return () => clearTimeout(timer);
  };

  const refreshSpaces = useCallback(async () => {
    const spaces: any[] = await SpaceService.getAllSpaces();
    const mySpaces = spaces.filter((x: any) => {
      const owners = typeof(x.owner) === 'string' ? [x.owner] : x.owner;
      return owners.includes(session.did);
    });
    const followingSpaces = spaces.filter((x: any) => {
      return (x.followers || []).includes(session.did)
    })
    setMySpaces(mySpaces);
    setFollowingSpaces(followingSpaces);
  }, [session]);

  useEffect(() => {
    (async () => {
      setLoadingText('loading spaces...');
      await refreshSpaces();
      setLoadingText('');
    })();
    setTimerForSpaces();
  }, []);

  const handleCreateSpace = async (space: Space) => {
    if (mySpaces.findIndex(_space => _space.name === space.name) > -1) {
      showNotify(
        'Space with same name already exist. Try with another name',
        'warning'
      );
      return;
    }
    await SpaceService.addSpace(session, space);
    refreshSpaces();
    setIsModalOpen(false);
  };
  return (
    <>
      <IonPage className={style['spacepage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <PageTitle>Spaces</PageTitle>
                  {mySpaces.length > 0 && (
                    <Button
                      text={'Create New Space'}
                      onClick={() => setIsModalOpen(true)}
                    />
                  )}
                </Header>
                <SpaceTabsContainer template="default">
                  <SpacePageHeader active={active} setActive={setActive} />
                  {loadingText && loadingText !== '' ? (
                    <LoadingIndicator loadingText={loadingText} />
                  ) : (
                    <>
                      {active === 'my spaces' &&
                        (mySpaces.length > 0 ? (
                          <SpaceListView spaces={mySpaces} />
                        ) : (
                          <CreateSpace
                            session={session}
                            openForm={() => setIsModalOpen(true)}
                          />
                        ))}
                      {active === 'following' && (
                        <SpaceListView
                          spaces={followingSpaces.filter((x: any) =>
                            (x.followers || []).includes(session.did)
                          )}
                          explore
                        />
                      )}
                    </>
                  )}
                </SpaceTabsContainer>
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
        <CreateSpaceForm
          onClose={() => {
            setIsModalOpen(false);
          }}
          submitForm={handleCreateSpace}
        />
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

export default connect(mapStateToProps, mapDispatchToProps)(SpacePage);
