import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonPage } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import SignedPublicPageHeader from 'src/components/layouts/SignedPublicPageHeader';
import { HiveClient, AppContextParameters } from '@tuum-tech/hive-js-sdk';
import { Logger } from '@tuum-tech/commons.js.tools';
import { HiveService } from 'src/services/hive.service';
//import { AppVaultScripts } from 'src/scripts/appvault.scriptsV2';
import {
  DID,
  connectivity
} from '@elastosfoundation/elastos-connectivity-sdk-js';
import { AppVaultScripts } from 'src/scripts/appvault.scriptsV2';
import { UserVaultMigration } from 'src/scripts/user.migration';

const MigrationPage = () => {
  const [ret, setRet] = useState('');
  const [resp, setResp] = useState('');

  const LOG = new Logger('MigrationPage');
  useEffect(() => {
    (async () => {
      let oldDid = 'did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX';
      let oldMnemonics =
        'curious push water point border mutual install govern message ordinary fish small';

      const oldVaultParams: any = {
        hiveHost: process.env.REACT_APP_HIVE_HOST as string,
        resolverUrl: process.env.REACT_APP_HIVE_RESOLVER_URL as string,
        resolverCache: process.env.REACT_APP_HIVE_CACHE_DIR as string,
        context: {
          storePath: process.env.REACT_APP_APPLICATION_STORE_PATH,
          appDID: oldDid,
          appMnemonics: oldMnemonics,
          appPhrasePass: '',
          appStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS,
          userDID: oldDid,
          userMnemonics: oldMnemonics,
          userPhrasePass: '',
          userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
        } as AppContextParameters
      };

      debugger;

      let oldHiveClient = await HiveClient.createInstance(oldVaultParams);

      try {
        let vaultInfo = await oldHiveClient.VaultSubscription.checkSubscription();
        if (vaultInfo === undefined) {
          await oldHiveClient.VaultSubscription.subscribe();
        }

        try {
          await oldHiveClient.Database.createCollection('test');
        } catch (e) {
          LOG.error('error creating collection');
        }
        await oldHiveClient.Database.insertOne('test', { did: oldDid });
      } catch (e) {
        LOG.error('error creating collection');
      }

      // let vaultInfo = await userHiveClient.VaultSubscription.subscribe();
      // userHiveClient.Database.createCollection('user collection');

      // let didAccess = new DID.DIDAccess();

      // let cred = await didAccess.requestCredentials({
      //   claims: [DID.simpleIdClaim('Your name', 'name', true)],
      //   didMustBePublished: true
      // });
      // debugger;

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
      //     userMnemonics: '',
      //     userPhrasePass: '',
      //     userStorePass: process.env.REACT_APP_APPLICATION_STORE_PASS
      //   } as AppContextParameters
      // };

      // debugger;
      // let userHiveClient = await HiveClient.createInstance(userParameters);
      // let vaultInfo = await userHiveClient.VaultSubscription.subscribe();
      // userHiveClient.Database.createCollection('user collection');
    })();
  }, [LOG]);

  return <>{resp}</>;
};

export default MigrationPage;
