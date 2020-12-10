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
  IonCol,
  IonInput,
  IonList,
  IonRouterLink,
  IonLabel
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
import ButtonDisabled from 'src/components/ButtonDisabled';
import IdentityProgressComponent from 'src/components/IdentityProgressComponent';

const ConfirmMnemonicPage : React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

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
    <IonPage className={style["confirmmnemonicpage"]}>
      <ClearlyMeContent>
        <IonHeader style={{height: '80px'}}>
          <Header />
        </IonHeader>

        <IdentityProgressComponent stage="confirm"></IdentityProgressComponent>
        <div className={style["main-container"]}>
          <h1>Re-enter security words</h1>

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
                <IonInput className={style["mnemonic"]} value="" readonly>
                  <span className={style["number"]}>12</span>
                </IonInput>
              </IonCol>              
            </IonRow>
          </div>

          <div>
            <p className={style["text"]}>
              Select the security words in the right order.
            </p>
          </div>

          {/* <div>
            <p className={style["error"]}>
              Invalid order, please enter correct order.
            </p>
          </div> */}

          <div>
            <IonRow>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>              
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonRouterLink href="/publish">
                  <IonInput className={style["mnemonic"]} value="bread" readonly>
                </IonInput>
                </IonRouterLink>
              </IonCol>                            
            </IonRow>
            <IonRow>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol> 
              <IonCol>
                <IonInput className={style["mnemonic"]} value="" readonly>
                </IonInput>
              </IonCol>                           
            </IonRow>            
          </div>

          <br/>
          <div style={{textAlign: 'center'}}>
            <ButtonDisabled href="/publish" disabled>Publish DID to Blockchain</ButtonDisabled>
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
  ConfirmMnemonicPage,
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
