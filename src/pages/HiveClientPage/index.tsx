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
      const hiveClient = await HiveClient.createInstance();

      //let vaultInfo = await hiveClient.VaultSubscription.subscribe();
      await hiveClient.Database.createCollection('test2');

      // setResp(resp as string);
      debugger;
    })();
  }, []);

  return <>{JSON.stringify(resp)}</>;
};

export default HiveClientPage;
