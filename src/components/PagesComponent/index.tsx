import React, { useEffect, useState } from 'react';
import { IonGrid, IonRow, IonCol } from '@ionic/react';
import style from './style.module.scss';
import google from '../../assets/logo_google.svg';
import facebook from '../../assets/logo_facebook.svg';
import twitter from '../../assets/logo_twitter.svg';
import linkedin from '../../assets/logo_linkedin.svg';

import { DidService } from 'src/services/did.service';
import { UserService } from 'src/services/user.service';
import {
  AssistService,
  IPublishDocumentResponse,
  RequestStatus,
} from 'src/services/assist.service';

const FollowingList: React.FC = () => {
  const [googleCredential, setGoogleCredential] = useState('');
  const [facebookCredential, setFacebookCredential] = useState('');
  const [twitterCredential, setTwitterCredential] = useState('');
  const [linkedinCredential, setLinkedinCredential] = useState('');
  const [publishStatus, setPublishStatus] = useState({ requestStatus: '' });
  const updateValues = async () => {
    let user = UserService.getLoggedUser();
    let document = await DidService.getDidDocument(user.did);

    if (!document) {
      console.log('document is empty');
      return;
    }
    document.verifiableCredential.forEach((item: any) => {
      let type = item.id.replace(`${user.did}#`, '');
      if (type === 'twitter') {
        setTwitterCredential(item.credentialSubject[type]);
      }
    });
  };

  const setTimer = () => {
    const timer = setTimeout(async () => {
      await refreshStatus();
    }, 15 * 1000);
    return () => clearTimeout(timer);
  };

  const refreshStatus = async () => {
    let publishWaiting = getWaitingPublishItens();
    if (publishWaiting.length <= 0) return;
    publishWaiting.forEach(async (confirmationId) => {
      console.log('checking assist confirmationId', confirmationId);
      let status = await AssistService.getRequestStatus(confirmationId);
      setPublishStatus(status);
      console.log(confirmationId, status);
      let actual = getActualStatus(confirmationId);
      if (actual.requestStatus === RequestStatus.NotFound) return;

      if (status.requestStatus !== actual.requestStatus) {
        if (status.requestStatus === RequestStatus.Completed) {
        } else {
          window.localStorage.setItem(
            'publish_' + confirmationId,
            JSON.stringify(status)
          );
        }
      }
    });
    setTimer();
  };
  const getActualStatus = (
    confirmationId: string
  ): IPublishDocumentResponse => {
    let item = window.localStorage.getItem('publish_' + confirmationId);
    if (item) return JSON.parse(item);
    return {
      confirmationId: confirmationId,
      requestStatus: RequestStatus.NotFound,
    };
  };

  const getWaitingPublishItens = () => {
    let response: string[] = [];
    for (var i = 0, len = window.localStorage.length; i < len; ++i) {
      let key = window.localStorage.key(i);
      if (key && key.startsWith('publish')) {
        response.push(key.replace('publish_', ''));
      }
    }
    return response;
  };

  const showPublishStatus = () => {
    if (publishStatus['requestStatus']) {
      return (
        <div>
          {' '}
          <span className={style['explore']}>
            DID Publish {publishStatus.requestStatus}
          </span>
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const openTwitter = () => {};

  useEffect(() => {
    (async () => {
      await updateValues();
      //await refreshStatus()
    })();
    setTimer();
  }, []);

  return (
    <div className={style['pagesList']}>
      {/*-- Default FollowingList --*/}

      <h1>Verified credentials</h1>
      <IonGrid>
        <IonRow>
          <IonCol size='*'>
            <img className={style['thumbnail']} src={google} alt='google' />
          </IonCol>
          <IonCol size='10'>
            <div>
              <span className={style['name']}>Google</span>
            </div>
            <div>
              <span className={style['number-followers']}>
                {googleCredential}
              </span>
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size='*'>
            <img className={style['thumbnail']} src={facebook} alt='facebook' />
          </IonCol>
          <IonCol size='10'>
            <div>
              <span className={style['name']}>Facebook</span>
            </div>
            <div>
              <span className={style['number-followers']}>
                {facebookCredential}
              </span>
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size='*'>
            <img className={style['thumbnail']} src={twitter} alt='twitter' />
          </IonCol>
          <IonCol size='10'>
            <span className={style['name']}>Twitter</span>
            <div>
              <span className={style['number-followers']}>
                {twitterCredential}
              </span>
            </div>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size='*'>
            <img className={style['thumbnail']} src={linkedin} alt='linkedin' />
          </IonCol>
          <IonCol size='10'>
            <span className={style['name']}>Linkedin</span>
            <div>
              <span className={style['number-followers']}>
                {linkedinCredential}
              </span>
            </div>
          </IonCol>
        </IonRow>
      </IonGrid>
      {showPublishStatus()}
    </div>
  );
};

export default FollowingList;
