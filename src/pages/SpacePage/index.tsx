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
import { SpaceService } from 'src/services/space.service';

import SpacePageHeader, {
  Header,
  PageTitle,
  SpaceTabsContainer
} from './components/SpacePageHeader';
import MySpaces from './components/MySpaces';
import { InferMappedProps, SubState } from './types';
import style from './style.module.scss';
import { Button } from 'src/elements/buttons';
import CreateSpace from './components/CreateSpace';
import CreateSpaceForm from './components/CreateSpaceForm';
import { TuumTechScriptService } from 'src/services/script.service';
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
  const [spaces, setSpaces] = useState<any[]>([]);
  const [active, setActive] = useState('my spaces');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const setTimerForSpaces = useCallback(() => {
    const timer = setTimeout(async () => {
      await refreshSpaces();
      setTimerForSpaces();
    }, 1000);
    return () => clearTimeout(timer);
  });

  const refreshSpaces = useCallback(async () => {
    let _spaces = await SpaceService.getAllSpaces(session);
    _spaces = _spaces.map((x: any) => ({ ...x, owner: session.did }));
    setSpaces(_spaces);
  }, [session]);

  useEffect(() => {
    setTimerForSpaces();
  }, [setTimerForSpaces]);

  const handleCreateSpace = async (space: Space) => {
    if (spaces.findIndex(_space => _space.name === space.name) > -1) {
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
                  {spaces.length > 0 && (
                    <Button
                      text={'Create New Space'}
                      onClick={() => setIsModalOpen(true)}
                    />
                  )}
                </Header>
                <SpaceTabsContainer template="default">
                  <SpacePageHeader active={active} setActive={setActive} />
                  {active === 'my spaces' &&
                    (spaces.length > 0 ? (
                      <MySpaces spaces={spaces} />
                    ) : (
                      <CreateSpace
                        session={session}
                        openForm={() => setIsModalOpen(true)}
                      />
                    ))}
                  {active === 'following' && <></>}
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
