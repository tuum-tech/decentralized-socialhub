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
  IonInput,
  IonCol,
  IonCheckbox,
  IonLabel,
  IonList,
  IonItem
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
import ClearlyMeContent from 'src/components/ClearlyMeContent';
import Header from 'src/components/Header';
import ButtonDefault from 'src/components/ButtonDefault';
import IdentityProgressComponent from 'src/components/IdentityProgressComponent';

const CreateIdentityPage : React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  const [msg, setMsg] = useState('');
  const [encrypt, setEncrypt] = useState(true);

  const simpleAjaxDirect = async ()=>{
    const msg = await fetchSimpleApi() as string;
    setMsg(msg);
  }

  return (
    <IonPage className={style["createidentitypage"]}>
      <ClearlyMeContent>
        <IonHeader style={{height: '80px'}}>
          <Header />
        </IonHeader>

        <IdentityProgressComponent stage="create"></IdentityProgressComponent>
        <div className={style["main-container"]}>
          <h1>Create Identity</h1>

          <div>
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>1</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="butter" readonly>
                  <span className={style["number"]}>2</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="jam" readonly>
                  <span className={style["number"]}>3</span>
                </IonInput>
              </IonCol>              
            </IonRow>
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>4</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>5</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>6</span>
                </IonInput>
              </IonCol>              
            </IonRow>
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>7</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>8</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>9</span>
                </IonInput>
              </IonCol>              
            </IonRow>            
            <IonRow style={{marginTop: '10px'}}>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>10</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>11</span>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="bread" readonly>
                  <span className={style["number"]}>12</span>
                </IonInput>
              </IonCol>              
            </IonRow>
          </div><br/><br/>

          <div className={encrypt ? style["warning-light"] : style["warning-emphasis"]}>
            <p className={style["text"]}>
            These are your security words (like a password).<br/><br />
            Lose these words and you will lose the identity. Keep them written down, in order, and safe. Write them down now.
            </p>
          </div>

          <IonList>
            <IonItem className={style["consent"]}>
              <IonLabel className={style["text"]}>Encrypt and save security words to my vault</IonLabel>
              <IonCheckbox checked={encrypt} slot="start" className={style["checkbox-label"]} onIonChange={e => setEncrypt(!encrypt)}></IonCheckbox>
            </IonItem>
          </IonList>
          <br/>
          <div style={{textAlign: 'center'}}>
            <ButtonDefault href="/confirm">Next</ButtonDefault>
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
  CreateIdentityPage,
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
