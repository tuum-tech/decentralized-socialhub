/**
 * Page
 */
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
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
import {
  DID,
  DIDURL,
  Issuer,
  VerifiableCredential
} from '@elastosfoundation/did-js-sdk/';
import { DidService } from 'src/services/did.service.new';

const LoadDid: React.FC<InferMappedProps> = ({
  eProps,
  ...props
}: InferMappedProps) => {
  const [document, setDocument] = useState('');

  useEffect(() => {
    (async () => {
      let service = await DidService.getInstance();
      let did_app = await service.loadDid(
        process.env.REACT_APP_APPLICATION_MNEMONICS as string
      );
      let did_user = await service.loadDid(
        'deliver crane orphan dismiss proud circle lawn cabbage fancy color clever tree'
      );

      console.log('did app' + did_app);
      console.log('did user' + did_user);

      let appDocument = await service.getStoredDocument(did_app);
      let userDocument = await service.getStoredDocument(did_user);

      // //let did = await service.loadDid(
      // //  'curious push water point border mutual install govern message ordinary fish small'
      // //);
      // console.log('did app' + did_app.did);
      // console.log('did user' + did_user.did);

      // let store = await DidService.getStore();
      // let appDocument = await store.loadDid(did_app.did);
      // let userDocument = await store.loadDid(did_user.did);

      let id: DIDURL = DIDURL.from('#primary', did_user) as DIDURL;
      let issuer = new Issuer(userDocument, id);
      let vcBuilder = new VerifiableCredential.Builder(
        issuer,
        DID.from(did_app) as DID
      );
      let vc = await vcBuilder
        .expirationDate(new Date('2026-01-01'))
        .type('AppIdCredential')
        .property('appDid', did_app.toString())
        .property('appInstanceDid', did_app.toString())
        .id(
          DIDURL.from('#app-id-credential', DID.from(did_app) as DID) as DIDURL
        )
        .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
      console.log(await vc.isValid());
      console.log(vc.toString(true));

      // console.log('app doc ' + appDocument.toString(true));
      // console.log('user doc ' + userDocument.toString(true));

      // let id: DIDURL = DIDURL.from(
      //   '#primary',
      //   DID.from(did_user.did as string) as DID
      // ) as DIDURL;
      // let issuer = new Issuer(userDocument, id);
      // let vcBuilder = new VerifiableCredential.Builder(
      //   issuer,
      //   DID.from(did_app.did) as DID
      // );
      // let vc = await vcBuilder
      //   .expirationDate(new Date('2026-01-01'))
      //   .type('AppIdCredential')
      //   .property('appDid', did_app.did)
      //   .property('appInstanceDid', did_app.did)
      //   .id(
      //     DIDURL.from(
      //       '#app-id-credential',
      //       DID.from(did_app.did) as DID
      //     ) as DIDURL
      //   )
      //   .seal(process.env.REACT_APP_DID_STORE_PASSWORD as string);
      // console.log(await vc.isValid());
      // console.log(vc.toString(true));

      // let a = JSON.parse(vc.toString(true));
      // delete a.proof.created;

      // let verif = await VerifiableCredential.parseContent(JSON.stringify(a));
      // console.log(verif.toString(true));

      // console.log(await verif.isValid());

      // setDocument(vc.toString(true));

      // let isValidHiveAddress = await HiveService.isHiveAddressValid(
      //   'https://vault.tuum.tech'
      // );
      // console.log('isHiveValid ' + isValidHiveAddress);
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
