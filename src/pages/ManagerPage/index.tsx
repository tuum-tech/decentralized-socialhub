/**
 * Page
 */
import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButton,
  IonGrid,
  IonRow,
  IonCol,
  IonModal
} from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useState } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';
import { fetchSimpleApi } from './fetchapi';
import Logo from 'src/components/Logo';
import Navbar from 'src/components/Navbar';
import styled from 'styled-components';
import ProfileEditor from 'src/components/ProfileEditor';
import AlphaContent from 'src/components/AlphaContent';


const ManagerPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  const [msg, setMsg] = useState('');
  const simpleAjaxDirect = async () => {
    const msg = (await fetchSimpleApi()) as string;
    setMsg(msg);
  };

  const Header = styled.div`
    width: 100%;
    height: 83px;
    background: #fff;
    padding: 27px 25px 20px 48px;
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
  `;

  return (
    <>
      <IonPage className={style['managerpage']}>
        <IonContent className={style['content-page']}>
          <IonGrid className={style['profilepagegrid']}>
            <IonRow className={style['profilecontent']}>
              <IonCol size='2' className={style['left-panel']}>
                <Logo />
                <Navbar tab='explore' />
              </IonCol>
              <IonCol size='10' className={style['right-panel']}>
                <Header>
                  <PageTitle>Profile Manager</PageTitle>
                </Header>
                <ProfileEditor></ProfileEditor>


              </IonCol>
            </IonRow>
          </IonGrid>

        </IonContent>
      </IonPage>
    </>
  );
};



const Popup = styled.div`
width: 541px;
height: 655px;
position: absolute;
top: 50%;
left: 50%;
/* bring your own prefixes */
transform: translate(-50%, -50%);
border-radius: 16px;
background-color: #ffffff;
box-shadow: 0px 0px 1px rgba(12, 26, 75, 0.24),
  0px 3px 8px -1px rgba(50, 50, 71, 0.05);

text-align: center;
font-family: 'SF Pro Display';

padding: 50px 56px;

display: flex;
flex-direction: column;
align-items: center;
justify-content: space-between;
`;




/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: { // eProps - Emitter proptypes thats binds to dispatch
      /** dispatch for counter to increment */
      onCount: (count: { counter: number }) => dispatch(incrementAction(count)),
      onSimpleAjax: () => dispatch(getSimpleAjax())
    }
  };
}

/**
 * Injects prop and saga bindings done via
 * useInjectReducer & useInjectSaga
 */
const withInjectedMode = injector(
  ManagerPage,
  {
    key: NameSpace,
    reducer,
    saga
  }
);

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
