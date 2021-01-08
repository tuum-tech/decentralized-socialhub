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
  IonInput,
  IonCol,
  IonRow
} from '@ionic/react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useContext, useState } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';
import { fetchSimpleApi } from './fetchapi';
import ClearlyMeContent from 'src/components/ClearlyMeContent';
import Header from 'src/components/Header';
import ButtonDefault from 'src/components/ButtonDefault';
import ButtonLight from 'src/components/ButtonLight';
import { toNumber } from 'lodash';
import { ElastosClient } from '@elastosfoundation/elastos-js-sdk';
import SessionContext from 'src/context/session.context';
import { Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { HiveClient, OptionsBuilder } from "@elastos/elastos-hive-js-sdk";


const ElastosMnemonicPage: React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {
  const history = useHistory();

  const { session, setSession } = useContext(SessionContext)
  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [msg, setMsg] = useState('');
  const [did, setDID] = useState('');
  const [vaultAddress, setVaultAddress] = useState('');

  const [indexPage, setIndexPage] = useState(0);

  const [mnemonic, setMnemonic] = useState(['', '', '', '', '', '', '', '', '', '', '', ''])

  const updateMnemonic = (event: any) => {
    let index: number = toNumber(event.target.outerText) - 1
    mnemonic[index] = event.target.value
    setMnemonic(mnemonic)
  }

  const mnemonicInput = (index: number) => {
    return <IonCol>
      <IonInput value={mnemonic[index]} onIonChange={updateMnemonic} className={style["mnemonic"]}>
        <span className={style["number"]}>{index + 1}</span>
      </IonInput>
    </IonCol>
  }

  const signIn = async () => {
    console.log(session)
    if (isMnemonicWordValid(0) &&
      isMnemonicWordValid(1) &&
      isMnemonicWordValid(2) &&
      isMnemonicWordValid(3) &&
      isMnemonicWordValid(4) &&
      isMnemonicWordValid(5) &&
      isMnemonicWordValid(6) &&
      isMnemonicWordValid(7) &&
      isMnemonicWordValid(8) &&
      isMnemonicWordValid(9) &&
      isMnemonicWordValid(10) &&
      isMnemonicWordValid(11)) {
      let userDid = await ElastosClient.did.loadFromMnemonic(mnemonic.join(" "))
      setDID(userDid.did)

      setIndexPage(1)
      setSession({ userDid: userDid })


    }
    else {
      console.log("invalid")
      setMsg("Invalid mnemonics")
    }
  }

  const otherVault = async () => {

    history.push("/profile", session)
  }

  const ownVault = () => {
    console.log(session)
    setIndexPage(2)
    //history.push("/profile", session)
  }

  const validateOwnVault = async () => {
    history.push("/profile", session)
  }

  const connectHive = async (hiveAddress: string) => {
   

  }

  const isMnemonicWordValid = (index: number): boolean => {
    let word: string = mnemonic[0];
    if (!word) return false
    return word.trim() !== ""
  }

  const divSelection = () => {
    if (indexPage == 0) {
      return <div>
        <h1>Sign in with elastOS</h1>
        <br />
        <p>Enter your 12 security words to sign in</p>

        <div>
          <IonRow style={{ marginTop: '10px' }}>
            {mnemonicInput(0)}
            {mnemonicInput(1)}
            {mnemonicInput(2)}
          </IonRow>
          <IonRow style={{ marginTop: '10px' }}>
            {mnemonicInput(3)}
            {mnemonicInput(4)}
            {mnemonicInput(5)}
          </IonRow>
          <IonRow style={{ marginTop: '10px' }}>
            {mnemonicInput(6)}
            {mnemonicInput(7)}
            {mnemonicInput(8)}
          </IonRow>
          <IonRow style={{ marginTop: '10px' }}>
            {mnemonicInput(9)}
            {mnemonicInput(10)}
            {mnemonicInput(11)}
          </IonRow>
        </div>

        <br /><br />
        <div style={{ textAlign: 'center' }}>
          <ButtonDefault onClick={signIn}>Sign in</ButtonDefault>
        </div>

        <p>{msg}</p>
      </div>
    }

    if (indexPage == 1) {
      return <div>
        <h1>Choose Your Vault</h1>

        <div className={style["warning-light"]}>
          <p className={style["text"]}>
            Vault options<br /><br />
          </p>
        </div>

        <div className={style["vault-list"]}>
          <IonRow style={{ marginTop: '10px' }}>
            <IonCol>
              <ButtonLight>Tuum Tech</ButtonLight>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '10px' }}>
            <IonCol>
              <ButtonLight>Trinity Tech</ButtonLight>
            </IonCol>
          </IonRow>
          <IonRow style={{ marginTop: '10px' }}>
            <IonCol>
              <ButtonLight onClick={ownVault}>My own vault</ButtonLight>
            </IonCol>
          </IonRow>
        </div><br /><br />
        <p>{did}</p>
        

      </div>
    }




    if (indexPage == 2) {
      return <div>
        <h1>Enter Your Vault</h1>

       

        <div >
          <IonRow style={{ marginTop: '150px' }}>
            <IonCol >

              <IonInput className={style["addressInput"]} value={vaultAddress} onIonChange={(event) => setVaultAddress((event.target as HTMLInputElement).value)} placeholder="Vault ip address" >
              </IonInput>
            </IonCol>
          </IonRow>

        </div>
       
      
        <div style={{ textAlign: 'center', marginTop: '150px' }}>
          <ButtonDefault onClick={validateOwnVault}>Connect</ButtonDefault>
        </div>

      </div>
    }

  }

  return (
    <IonPage className={style["elastosmnemonicpage"]}>
      <ClearlyMeContent>
        <IonHeader style={{ height: '80px' }}>
          <Header />
        </IonHeader>
        <div className={style["main-container"]}>
          {divSelection()}
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
  ElastosMnemonicPage,
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
