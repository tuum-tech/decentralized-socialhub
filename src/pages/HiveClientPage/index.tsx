import React, { useEffect, useState } from 'react';
import { IonCard, IonCardContent, IonPage } from '@ionic/react';
import styled from 'styled-components';

import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';

import { makeSelectSession } from 'src/store/users/selectors';
import { setSession } from 'src/store/users/actions';
import SignedPublicPageHeader from 'src/components/layouts/SignedPublicPageHeader';
import { HiveClient } from 'src/shared-base/api/hiveclient';

const HiveClientPage = () => {
  const [ret, setRet] = useState('');
  const [resp, setResp] = useState('');
  useEffect(() => {
    (async () => {
      // const anonymous = await HiveClient.createAnonymousInstance("http://localhost:9001");

      // debugger;
      // let rets = await anonymous.Scripting.callScript("get_users_by_dids", {
      //   "limit": 200,
      //   "skip": 0,
      //   "dids": []
      // },"did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX","did:elastos:iag8qwq1xPBpLsGv4zR4CmzLpLUkBNfPHX");

      // debugger;
      // setRet(rets as string);

      const hiveClient = await HiveClient.createInstance();
      debugger;

      //let vaultInfo = await hiveClient.VaultSubscription.subscribe();
      await hiveClient.Database.createCollection('test2');

      // setResp(resp as string);
      debugger;
    })();
  }, []);

  return <>{JSON.stringify(resp)}</>;
};

export default HiveClientPage;
