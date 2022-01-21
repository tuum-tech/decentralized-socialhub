import React, { useEffect, useState } from 'react';
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

const CustomModal = styled(IonModal)`
  --height: 710px;
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
  useEffect(() => {
    refreshSpaces();
  }, []);

  const refreshSpaces = async () => {
    const _spaces = await SpaceService.getAllSpaces(session);
    setSpaces(_spaces);
  };
  const handleCreateSpace = async (space: Space) => {
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
                      <MySpaces session={session} spaces={spaces} />
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
