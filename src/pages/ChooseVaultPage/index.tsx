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
  IonRow,
  IonCol
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
import Header from 'src/components/Header';
import ClearlyMeContent from 'src/components/ClearlyMeContent';
import VaultProgressComponent from 'src/components/VaultProgressComponent';
import ButtonDefault from 'src/components/ButtonDefault';
import ButtonLight from 'src/components/ButtonLight';

const ChooseVault : React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [msg, setMsg] = useState('');
  const simpleAjaxDirect = async ()=>{
    const msg = await fetchSimpleApi() as string;
    setMsg(msg);
  }

  return (
    <IonPage className={style["choosevault"]}>
      <ClearlyMeContent>
        <IonHeader style={{height: '80px'}}>
          <Header />
        </IonHeader>

        <VaultProgressComponent stage="choose"></VaultProgressComponent>
        <div className={style["main-container"]}>
          <h1>Choose Your Vault</h1>

          <div className={style["warning-light"]}>
            <p className={style["text"]}>
            Vault options<br/><br />
            </p>
          </div>

          <div className={style["vault-list"]}>
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <ButtonLight >Tuum Tech</ButtonLight>
              </IonCol>
            </IonRow>
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <ButtonLight>Trinity Tech</ButtonLight>
              </IonCol>
            </IonRow>
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <ButtonLight>My own vault</ButtonLight>
              </IonCol>
            </IonRow>
          </div><br/><br/>

          {/* <IonList>
            <IonItem className={style["consent"]}>
              <IonLabel className={style["text"]}>Encrypt and save security words to my vault</IonLabel>
              <IonCheckbox checked={encrypt} slot="start" className={style["checkbox-label"]} onIonChange={e => setEncrypt(!encrypt)}></IonCheckbox>
            </IonItem>
          </IonList> */}
          <br/>
          <div style={{textAlign: 'center'}}>
            <ButtonDefault href="/profile">Next</ButtonDefault>
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
  ChooseVault,
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
