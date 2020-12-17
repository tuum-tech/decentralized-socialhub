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
import { connect, useStore } from 'react-redux';
import { compose } from 'redux';
import { createStructuredSelector } from 'reselect';
import injector from 'src/baseplate/injectorWrap';
import { makeSelectCounter, makeSelectAjaxMsg } from './selectors';
import { incrementAction, getSimpleAjax } from './actions';
import React, { memo, useContext, useEffect, useState } from 'react';
import style from './style.module.scss';
import { NameSpace } from './constants';
import reducer from './reducer';
import saga from './saga';
import { InferMappedProps, SubState } from './types';
import { generateMnemonic } from './fetchapi';
import ClearlyMeContent from 'src/components/ClearlyMeContent';
import Header from 'src/components/Header';
import ButtonDefault from 'src/components/ButtonDefault';
import IdentityProgressComponent from 'src/components/IdentityProgressComponent';
// import MnemonicContext from 'src/context/MnemonicContext';

const CreateIdentityPage : React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

  /** 
   * Direct method implementation without SAGA 
   * This was to show you dont need to put everything to global state 
   * incoming from Server API calls. Maintain a local state.
  */
  // const [msg, setMsg] = useState('');
  const [encrypt, setEncrypt] = useState(true);
  // const {mnemonic, setMnemonic, setDid} = useContext(MnemonicContext)
  // const simpleAjaxDirect = async ()=>{
  //   const msg = await fetchSimpleApi() as string;
  //   setMsg(msg);
  // }

  useEffect(() => {
    
    async function generateDid()
    {
      let savedMnemonic = localStorage.getItem("mnemonic");
      // console.log("savedMnemonic from generateDid");
      // console.log(savedMnemonic);
      
      if(savedMnemonic) {
        setMnemonic(JSON.parse(savedMnemonic));
        // console.log("setMnemonic");
      } else {
        /*eslint-disable no-undef*/
        const mnemonicObject = await generateMnemonic() as any;
        setMnemonic(mnemonicObject.mnemonic.split(' '));
        // console.log("saving in localStorage");
        localStorage.setItem("mnemonic", JSON.stringify(mnemonicObject.mnemonic.split(' ')));
        // setDid(mnemonicObject.did.replace('did:elastos:', ''));
        /*eslint-disable no-undef*/        
      }

    }

    if (!mnemonic || mnemonic[0] === "-") generateDid();

  }, []);

  // const [isLogged, setIsLogged] = useState(false);
  
  const [mnemonic, setMnemonic] = useState([
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
    "-",
  ]);
  const [did, setDid] = useState(null);

  const MnemonicItem = (mnemonic:any) => {
    return (
      <>
        <div className={style["mnemonic"]}>
          <span className={style["number"]}>{mnemonic.number}</span>
          {mnemonic.title}
        </div>
      </>
    )
  }

  return (
    // <MnemonicContext.Provider
    // value={{
    //   mnemonic,
    //   setMnemonic: (generatedMnemonic:any) => setMnemonic(generatedMnemonic),
    //   did,
    //   setDid: (generatedDid:any) => setDid(generatedDid),
    //   isLogged
    // }}
    // >    
    <IonPage className={style["createidentitypage"]}>
      <ClearlyMeContent>
        <IonHeader style={{height: '80px'}}>
          <Header />
        </IonHeader>

        <IdentityProgressComponent stage="create"></IdentityProgressComponent>
        <div className={style["main-container"]}>
          <h1>Create Identity</h1>

          <div className={style["mnemonic-wrapper"]}>
            {
              mnemonic.map((item:any, key:any) => <MnemonicItem key={`mnemonic-key-${key}`} number={key + 1} title={item} />)
            }
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
    // </MnemonicContext.Provider>
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
