import { IonCol, IonContent, IonGrid, IonPage, IonRow } from '@ionic/react';
import React, { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useBreakpoint } from 'styled-breakpoints/react-styled';
import { up, down } from 'styled-breakpoints';
import styled from 'styled-components';
import { AssistService, RequestStatus } from 'src/services/assist.service';
import useSession from 'src/hooks/useSession';
import HeaderMobile from '../HeaderMobile';
import LeftSideMenu from '../LeftSideMenu';
import style from './style.module.scss';

const LeftCol = styled(IonCol)`
  flex: 0 0 250px;
  background-color: #f7fafc;
  margin: 0;
  padding: 0;
  ${down('sm')} {
    display: none;
  }
`;

const RightCol = styled(IonCol)`
  flex: 0 0;
  flex-grow: 1;
  background: #f7fafc;
  padding: 0;
  margin: 0;
`;

const Title = styled.h1`
  color: var(--txt-heading-dark);
  background: white;
  font-family: 'SF Pro Display';
  font-style: normal;
  font-weight: 600;
  font-size: 28px;
  padding: 20px;
  margin-bottom: 0;
`;

interface IProps {
  children: ReactNode;
}

const MainLayout: FC<IProps> = ({ children }: IProps) => {
  const { session } = useSession();
  const [publishStatus, setPublishStatus] = useState(RequestStatus.NotFound);
  const isSmUp = useBreakpoint(up('sm'));
  const history = useHistory();
  const title = useMemo(() => {
    const { pathname } = history.location;
    return pathname === '/profile'
      ? 'Dashboard'
      : pathname === '/manager'
      ? 'Profile Manager'
      : '';
  }, [history.location.pathname]);

  useEffect(() => {
    refreshStatus();
  }, []);

  const refreshStatus = async () => {
    if (session && session.did) {
      let publishWaiting = AssistService.getPublishStatusTask(session.did);
      if (!publishWaiting) {
        return;
      }
      let actual = await AssistService.refreshRequestStatus(
        publishWaiting.confirmationId,
        session.did
      );
      setPublishStatus(actual.requestStatus);
    }
  };

  return (
    <IonPage>
      <HeaderMobile sessionItem={session} publishStatus={publishStatus} />
      {!isSmUp && <Title>{title}</Title>}
      <IonContent className={style['content']}>
        <IonGrid className={style['grid']}>
          <IonRow className={style['row']}>
            <LeftCol>
              <LeftSideMenu />
            </LeftCol>
            <RightCol>{children}</RightCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default MainLayout;
