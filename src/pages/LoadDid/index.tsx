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
  IonButton
} from '@ionic/react';
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
import { fetchSimpleApi } from './fetchapi';
import { DidService } from 'src/services/did.service.new';
import { DID, DIDDocument } from '@elastosfoundation/did-js-sdk/typings';
import { HiveService } from 'src/services/hive.service';

const LoadDid: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [document, setDocument] = useState('');

  useEffect(() => {
    (async () => {
      debugger;
      let service = new DidService();
      //let did = await service.loadDid("scorpion flock piano man calm label basket sentence curious stove inform whisper");
      let did = await service.loadDid(
        'curious push water point border mutual install govern message ordinary fish small'
      );
      console.log('did ' + did.did);

      let store = await DidService.getStore();
      let didDocument = await store.loadDid(did.did);

      console.log('didDoc ' + didDocument.toString(true));

      setDocument(didDocument.toString(true));

      let isValidHiveAddress = await HiveService.isHiveAddressValid(
        'https://vault.tuum.tech'
      );
      console.log('isHiveValid ' + isValidHiveAddress);
    })();
  }, []);

  return (
    <IonPage className={style['loaddid']}>
      <IonHeader>
        <IonToolbar>
          <IonTitle>{document ? document : 'not loaded'}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent></IonContent>
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
const withInjectedMode = injector(LoadDid, {
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
