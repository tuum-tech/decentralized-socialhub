import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonPage } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import SignedPublicPageHeader from 'src/components/layouts/SignedPublicPageHeader';
import { HiveClient, AppContextParameters } from '@tuum-tech/hive-js-sdk';
import { HiveService } from 'src/services/hive.service';
//import { AppVaultScripts } from 'src/scripts/appvault.scriptsV2';
import {
  DID,
  connectivity
} from '@elastosfoundation/elastos-connectivity-sdk-js';
import { AppVaultScripts } from 'src/scripts/appvault.scriptsV2';

const HiveClientPage = () => {
  const [ret, setRet] = useState('');
  const [resp, setResp] = useState('');
  useEffect(() => {
    (async () => {
      // let tuumVaultHiveClient = (await HiveService.getApplicationHiveClient(
      //   `${process.env.REACT_APP_HIVE_HOST}`
      // )) as HiveClient;
      // let appVaultscripts = new AppVaultScripts();
      // await appVaultscripts.Execute(tuumVaultHiveClient);

      // const userParameters: any = {
      //   hiveHost: process.env.REACT_APP_HIVE_HOST as string,
      //   resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
      //   resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
      //   context: {
      //     storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
      //     appDID: process.env.REACT_APP_APPLICATION_DID,
      //     appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
      //     appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
      //     appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
      //     userDID: 'did:elastos:iWqo4UfANavywAdSeHEtZMERNrjPsZdDrY',
      //     userMnemonics:
      //       'off blue outside have farm torch sail image screen odor secret true',
      //     userPhrasePass: 'password',
      //     userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
      //   } as AppContextParameters
      // };

      // debugger;
      // let userHiveClient = await HiveClient.createInstance(userParameters);
      // let vaultInfo = await userHiveClient.VaultSubscription.subscribe();
      // userHiveClient.Database.createCollection('user collection');

      // let didAccess = new DID.DIDAccess();

      // let cred = await didAccess.requestCredentials({
      //   claims: [DID.simpleIdClaim('Your name', 'name', true)],
      //   didMustBePublished: true
      // });
      // debugger;

      const userParameters: any = {
        hiveHost: process.env.REACT_APP_HIVE_HOST as string,
        resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
        resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
        context: {
          storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
          appDID: process.env.REACT_APP_APPLICATION_DID,
          appMnemonics: process.env.REACT_APP_APPLICATION_MNEMONICS,
          appPhrasePass: process.env.REACT_APP_APPLICATION_PASSPHRASE,
          appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
          userDID: '',
          userMnemonics: '',
          userPhrasePass: '',
          userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
        } as AppContextParameters
      };

      let userHiveClient = await HiveClient.createInstance(userParameters);
      let vaultInfo = await userHiveClient.VaultSubscription.subscribe();
      userHiveClient.Database.createCollection('user collection');
    })();
  }, []);

  return <>{resp}</>;
};

export default HiveClientPage;
