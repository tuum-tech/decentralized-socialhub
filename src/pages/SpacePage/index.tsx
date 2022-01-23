import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import { TuumTechScriptService } from 'src/services/script.service';

import SpacePageHeader, {
  Header,
  PageTitle,
  SpaceTabsContainer
} from './components/SpacePageHeader';
import MySpaces from './components/MySpaces';
import { InferMappedProps, SubState } from './types';
import style from './style.module.scss';

const SpacePage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const { session } = props;
  const [active, setActive] = useState('my spaces');

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
                </Header>
                <SpaceTabsContainer template="default">
                  <SpacePageHeader active={active} setActive={setActive} />
                  {active === 'my spaces' && <MySpaces session={session} />}
                  {active === 'following' && <></>}
                </SpaceTabsContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(SpacePage);
