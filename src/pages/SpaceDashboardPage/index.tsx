/**
 * Page
 */
import { IonContent, IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import React, { useState, useEffect, useMemo } from 'react';
import { RouteComponentProps } from 'react-router';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { useRecoilState } from 'recoil';
import { SyncSpaceAtom } from 'src/Atoms/Atoms';

import useQuery from 'src/hooks/useQuery';
import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import { InferMappedProps, SubState } from './types';

import LeftSideMenu from 'src/components/layouts/LeftSideMenu';
import style from './style.module.scss';
import ProfileEditor from './components/ProfileEditor';
import LoadingIndicator from 'src/elements/LoadingIndicator';
import { defaultSpace, SpaceService } from 'src/services/space.service';

import arrowLeft from 'src/assets/icon/arrow-left-square.svg';

const Header = styled.div`
  width: 100%;
  height: 83px;
  background: #fff;
  padding: 10px 48px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const Flex = styled.div`
  display: flex;
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

const SpaceTitle = styled.h3`
  font-family: SF Pro Display;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 136.02%;
  color: #425466;
`;

const GoBack = styled.img`
  margin-right: 5px;
  cursor: pointer;
`;

interface MatchParams {
  name: string;
}

interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const ManagerPage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  const spaceName = props.match.params.name;
  const history = useHistory();
  const query = useQuery();
  const type = query.get('type');
  const { session } = props;
  const [syncSpace, setSyncSpace] = useRecoilState(SyncSpaceAtom);
  const [spaceProfile, setSpaceProfile] = useState<any>(defaultSpace);
  const isOwner = useMemo(() => {
    const owners = spaceProfile.owner
      ? typeof spaceProfile.owner === 'string'
        ? [spaceProfile.owner]
        : spaceProfile.owner
      : [];
    return owners.includes(session.did);
  }, [spaceProfile, session]);

  const capitalize = (s: string) => {
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const updateSpace = async () => {
    if (!spaceName) return;
    let names = [...new Set([spaceName, capitalize(spaceName)])];
    let spaces = [];
    if (type === 'community') {
      spaces = await SpaceService.getCommunitySpaceByNames(names);
    } else {
      spaces = await SpaceService.getSpaceByNames(session, names);
    }
    if (spaces.length > 0) {
      setSpaceProfile(spaces[0]);
    }
  };
  useEffect(() => {
    if (session && spaceName) {
      (async () => {
        await updateSpace();
      })();
    }
  }, [session, spaceName, type]);

  useEffect(() => {
    if (syncSpace) {
      (async () => {
        await updateSpace();
        setSyncSpace(false);
      })();
    }
  }, [syncSpace]);
  return (
    <>
      <IonPage className={style['managerpage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size="2" className={style['left-panel']}>
                <LeftSideMenu />
              </IonCol>
              <IonCol size="10" className={style['right-panel']}>
                <Header>
                  <Flex>
                    <GoBack
                      onClick={() => history.push('/spaces')}
                      src={arrowLeft}
                      alt="arrow-left"
                    />
                    <div>
                      <PageTitle>Spaces</PageTitle>
                      <SpaceTitle>{spaceProfile.name}</SpaceTitle>
                    </div>
                  </Flex>
                </Header>
                {isOwner ? (
                  <ProfileEditor session={session} profile={spaceProfile} />
                ) : (
                  <LoadingIndicator loadingText="Loading..." />
                )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManagerPage);
