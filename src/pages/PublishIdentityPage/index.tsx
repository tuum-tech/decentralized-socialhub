/**
 * Page
 */
import { IonHeader, IonPage } from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';

import ClearlyMeContent from 'src/components/oldComponents/ClearlyMeContent';
import Header from 'src/components/oldComponents/OldHeader';
import ButtonDefault from 'src/components/buttons/ButtonDefault';

import IdentityProgressComponent from './components/IdentityProgressComponent';

const PublishIdentityPage: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  /**
   * Direct method implementation without SAGA
   * This was to show you dont need to put everything to global state
   * incoming from Server API calls. Maintain a local state.
   */
  // const [msg, setMsg] = useState('');
  // const simpleAjaxDirect = async ()=>{
  //   const msg = await fetchSimpleApi() as string;
  //   setMsg(msg);
  // }

  const [mnemonic, setMnemonic] = useState([
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-',
    '-'
  ]);

  const publishDocument = async () => {
    // let confirmation = await PublishDocument(mnemonic, {})
  };

  const MnemonicItem = (mnemonic: any) => {
    return (
      <>
        <div className={style['mnemonic'] + ' ' + style['mnemonic-item']}>
          <span className={style['number-dark']}>{mnemonic.number}</span>
          {mnemonic.title}
        </div>
      </>
    );
  };

  useEffect(() => {
    async function getMnemonic() {
      let savedMnemonic = localStorage.getItem('mnemonic');

      if (savedMnemonic) {
        setMnemonic(JSON.parse(savedMnemonic));
      }
    }

    if (!mnemonic || mnemonic[0] === '-') getMnemonic();
  }, []);

  return (
    <IonPage className={style['publishidentitypage']}>
      <ClearlyMeContent>
        <IonHeader style={{ height: '80px' }}>
          <Header />
        </IonHeader>

        <IdentityProgressComponent stage="publish"></IdentityProgressComponent>
        <div className={style['main-container']}>
          <h1>Publish Identity</h1>

          <div className={style['mnemonic-wrapper']}>
            {mnemonic.map((item: any, key: any) => (
              <MnemonicItem
                key={`mnemonic-key-${key}`}
                number={key + 1}
                title={item}
              />
            ))}
          </div>
          <br />
          <br />

          {/*
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number-dark"]}>10</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number-dark"]}>11</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number-dark"]}>12</span>
                </IonInput>
              </IonCol>
            </IonRow> */}
          {/* </div><br/><br/> */}

          <div>
            <p className={style['text']}>
              Publish your newly created identity to the blockchain.
              <br />
              <br />
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <ButtonDefault href="/choosevault">
              Publish to Blockchain
            </ButtonDefault>
          </div>
        </div>
      </ClearlyMeContent>
    </IonPage>
  );
};

/** @returns {object} Contains state props from selectors */
export const mapStateToProps = createStructuredSelector<SubState, SubState>({
  counter: makeSelectCounter(),
  msg: makeSelectAjaxMsg()
});

/** @returns {object} Contains dispatchable props */
export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      // eProps - Emitter proptypes thats binds to dispatch
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
const withInjectedMode = injector(PublishIdentityPage, {
  key: NameSpace,
  reducer,
  saga
});

const withConnect = connect(mapStateToProps, mapDispatchToProps);

export default compose(
  withConnect,
  memo
)(withInjectedMode) as React.ComponentType<InferMappedProps>;

// export default Tab1;
