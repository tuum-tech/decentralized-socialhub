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
import ButtonDisabled from 'src/components/ButtonDisabled';
import IdentityProgressComponent from 'src/components/IdentityProgressComponent';
// import MnemonicContext from 'src/context/MnemonicContext';

const ConfirmMnemonicPage : React.FC<InferMappedProps> = ({ eProps, ...props }: InferMappedProps) => {

  console.log("Confirm page");
  let mnemonic:any = localStorage.getItem("mnemonic");
  
  if(mnemonic) {
    mnemonic = JSON.parse(mnemonic);
    // console.log("setMnemonic");
  } else {
    // redirect to create identity page
    // history.replaceState([], "", "/home");
  }

  const [shuffleMnenonics, setShuffleMnenonics] = useState([]);
  const [words, setWords] = useState(["", "", "", "", "", "", "", "", "", "", "", ""]);
  const [nextIndex, setNextIndex] = useState(0);
  const item = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const selectWord = (index:any) => {
      if (nextIndex > 12) return
      words[nextIndex] = shuffleMnenonics[index]
      setWords(words)
      setNextIndex(nextIndex + 1);
  }

  const showButton = ()=>{
    if (nextIndex < 12 || isValid(mnemonic)) return <div className="buttons-collection">
        <ButtonDefault style={{width: '49%'}} className={nextIndex <= 0 || isValid(mnemonic) ? style["btn-disabled"] : ""} 
        title="Undo" onClick={undo} disabled={nextIndex <= 0 || isValid(mnemonic)}>Undo</ButtonDefault>
        <ButtonDefault href="/publish" style={{width: '49%'}} className={isValid(mnemonic) ? "" : style["btn-disabled"]}
        title="Continue" disabled={!isValid(mnemonic)}>Continue</ButtonDefault>
    </div>

    return <ButtonDefault title="Start over" onClick={reset}>Start over</ButtonDefault>
  }

  const reset = ()=>{
      setWords(["", "", "", "", "", "", "", "", "", "", "", ""])
      setNextIndex(0)
  }

  const MnemonicWord = function(mnemonic:any) {
    if (mnemonic.hide) {
      return (<div className={style["mnemonic"] + " " + style["hide"]} onClick={mnemonic.click} style={{width: '30%', display: 'inline-block', margin: '0.2em'}}>
        </div>)      
    } else {
        return (<div className={style["mnemonic"] + " " + style["shuffled"]} onClick={mnemonic.click}>
            {mnemonic.title}
        </div>)
    }
  }

  const MnemonicInput = (mnemonic:any) => {
    return (
      <>
        <div className={style["mnemonic"]}>
          <span className={mnemonic.title ? style["number-dark"] : style["number"]}>{mnemonic.number}</span>
          {mnemonic.title}
        </div>
      </>
    )
  }

  const shuffle = function(arr:any) {
      var currentIndex = arr.length, temporaryValue, randomIndex;

      while (0 !== currentIndex) {
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;

          temporaryValue = arr[currentIndex];
          arr[currentIndex] = arr[randomIndex];
          arr[randomIndex] = temporaryValue;
      }

      return arr;
  }



  const isValid = (mnemonic:any) => {
    return mnemonic.every((value:any, index:any) => value === words[index])
  }

  const undo = () => {
      words[nextIndex - 1] = ""
      setWords(words)
      setNextIndex(nextIndex -1);
  }

  const containsWord = (word:string) => {
      let contains = false
      words.forEach((value, index) => {
          if (value === word) contains = true
      })
      return contains
  }  

  if (shuffleMnenonics.length <= 0) {
    setShuffleMnenonics(shuffle([...mnemonic]))
  }

  console.log("shuffled mnemonic");
  console.log(mnemonic);
  

  return (
    <IonPage className={style["confirmmnemonicpage"]}>
      <ClearlyMeContent>
        <IonHeader style={{height: '80px'}}>
          <Header />
        </IonHeader>

        <IdentityProgressComponent stage="confirm"></IdentityProgressComponent>
        <div className={style["main-container"]}>
          <h1>Re-enter security words</h1>

          <div className={style["mnemonic-wrapper"]}>
            {
              item.map((number:any, key:any) => <MnemonicInput key={`mnemonic-key-${key}`} number={item[number - 1]} title={words[number - 1]} />)
            }
          </div>

          <div style={{display: nextIndex < 12 ? 'inline-block' : 'none'}}>
            <p className={style["text"]}>
              Select the security words in the right order.
            </p>
          </div>

          <div style={{display: nextIndex >= 12 && !isValid(mnemonic) ? 'inline-block' : 'none'}}>
            <p className={style["error"]}>
              Invalid order, please enter correct order.
            </p>
          </div>

          <div>
            {
              shuffleMnenonics.map((item, key) => <MnemonicWord hide={containsWord(item)} key={`mnemonic-word-${key}`} title={item} click={() => { selectWord(key) }} />)              
            }
          </div>

          <br/>
          <div style={{textAlign: 'center'}}>
            {showButton()}
            {/* <ButtonDisabled href="/publish" disabled>Publish DID to Blockchain</ButtonDisabled> */}
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
