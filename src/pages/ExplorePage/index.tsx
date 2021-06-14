import React, { useState, useEffect } from 'react';
import { IonPage, IonGrid, IonRow, IonCol } from '@ionic/react';
import { RouteComponentProps } from 'react-router';
import styled from 'styled-components';

import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { makeSelectSession } from 'src/store/users/selectors';
import { SubState, InferMappedProps } from './types';
import { setSession } from 'src/store/users/actions';

import Logo from 'src/components/Logo';
import LeftSideMenu from 'src/components/layouts/LeftSideMenu';

import ProfileComponent from './components/ProfileComponent';
import SearchComponent from './components/SearchComponent';
import arrowLeft from '../../assets/icon/arrow-left-square.svg';

import style from './style.module.scss';

const Header = styled.div`
  width: 100%;
  // height: 83px;
  background: #fff;
  padding: 13px 15px 10px 22px;
  border-bottom: 1px solid #edf2f7;s
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
  display: inline;
  margin-left: 10px;
`;

const ArrowImage = styled.img`
  margin-bottom: 5px;
`;

interface MatchParams {
  did: string;
}
interface PageProps
  extends InferMappedProps,
    RouteComponentProps<MatchParams> {}

const ExplorePage: React.FC<PageProps> = ({ eProps, ...props }: PageProps) => {
  const [publicFields, setPublicFields] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      const pFields = await ProfileService.getPublicFields(
        props.match.params.did
      );
      setPublicFields(pFields);
    })();
  }, [props.match.params.did]);

  return (
    <IonPage className={style['explorepage']}>
      <IonGrid className={style['profilepagegrid']}>
        <IonRow className={style['profilecontent']}>
          <IonCol size="2" className={style['left-panel']}>
            <Logo />
            <LeftSideMenu />
          </IonCol>
          <IonCol size="10" className={style['right-panel']}>
            {props.match.params.did === undefined ? (
              <SearchComponent userSession={props.session} />
            ) : (
              <div className={style['exploreprofilecomponent']}>
                <Header>
                  <ArrowImage
                    onClick={() => (window.location.href = '/explore')}
                    src={arrowLeft}
                    alt="arrow-left"
                  />
                  <PageTitle>Explore</PageTitle>
                </Header>
                <ProfileComponent
                  publicFields={publicFields}
                  userSession={props.session}
                  targetDid={props.match.params.did}
                />
              </div>
            )}
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonPage>
  );
};

// export default ExplorePage;
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

export default connect(mapStateToProps, mapDispatchToProps)(ExplorePage);
