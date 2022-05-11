/* eslint-disable no-useless-escape */
import { IonButton, IonInput, IonRadio, IonRadioGroup } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';
import { HiveService } from 'src/services/hive.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { ProfileService } from 'src/services/profile.service';
import { UserVaultScripts } from 'src/scripts/uservault.script';
import useSession from 'src/hooks/useSession';

import { connect } from 'react-redux';
import { setSession } from 'src/store/users/actions';

import tuumlogo from '../../../../../assets/tuumtech.png';
import styled from 'styled-components';
import { DID, DIDDocument, DIDURL } from '@elastosfoundation/did-js-sdk/';
import { DidcredsService } from 'src/services/didcreds.service';
import { useSetRecoilState } from 'recoil';
import { DIDDocumentAtom } from 'src/Atoms/Atoms';
import { HiveClient } from 'src/shared-base/api/hiveclient';
import { HiveException } from '@elastosfoundation/hive-js-sdk/';
import { Logger } from 'src/shared-base/logger';
import style from '../style.module.scss';

const VersionTag = styled.div`
  display: flex;
  align-items: center;

  p {
    background: #cbd5e0;
    border-radius: 10px;
    padding: 5px;

    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    color: #4a5568;
  }
`;

interface ITutorialStepProp {
  onContinue: (session?: ISessionItem) => void;
  setLoading?: (status: boolean) => void;
  setLoadingText: (text: string) => void;
}

const TutorialStep3Component: React.FC<ITutorialStepProp> = props => {
  const { session, setSession } = useSession();

  const [hiveUrl, sethiveUrl] = useState('');
  const [hiveDocument, setHiveDocument] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningRead, setWarningRead] = useState(false);
  const [tuumHiveVersion, setTuumHiveVersion] = useState('');
  const [detectedHiveVersion, setDetectedHiveVersion] = useState('');
  const [selected, setSelected] = useState(
    hiveDocument === '' ? 'tuum' : 'document'
  );
  const setDidDocument = useSetRecoilState(DIDDocumentAtom);

  const getEndpoint = () => {
    if (selected === 'document') return hiveDocument;
    if (selected === 'tuum') return `${process.env.REACT_APP_HIVE_HOST}`;
    return hiveUrl;
  };

  const isEndpointValid = (endpoint: string) => {
    if (!endpoint || endpoint.length === 0) return false;
    let regexp = new RegExp(
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
    );
    return regexp.test(endpoint);
  };

  const saveSelection = async () => {
    setErrorMessage('');
    let endpoint = getEndpoint();

    let endpointValid = isEndpointValid(endpoint);
    if (!endpointValid || !props.setLoading) {
      console.log('Endpoint not valid: ', endpoint);
      setErrorMessage('Invalid hive address');
      return;
    }

    props.setLoading(true);
    let isValidHiveAddress = await HiveService.isHiveAddressValid(endpoint);
    if (!isValidHiveAddress) {
      props.setLoading(false);
      console.log('Not valid address: ', endpoint);
      setErrorMessage('Invalid hive address');
      return;
    }

    if (!warningRead) {
      let hiveVersion = await HiveClient.getHiveVersion(endpoint);

      if (!(await HiveService.isHiveVersionSet(hiveVersion))) {
        props.setLoading(false);
        setErrorMessage(
          `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
        );
        setWarningRead(true);
        return;
      }

      try {
        let isVersionSupported = await HiveService.isHiveVersionSupported(
          hiveVersion
        );
        if (!isVersionSupported) {
          props.setLoading(false);
          setErrorMessage(
            `Hive version ${hiveVersion} not supported. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
          );
          return;
        }
      } catch (e) {
        props.setLoading(false);
        setErrorMessage(
          `Hive version could not be verified. The minimal supported version is ${process.env.REACT_APP_HIVE_MIN_VERSION} and maximun is ${process.env.REACT_APP_HIVE_MAX_VERSION}`
        );
        setWarningRead(true);
        return;
      }
    }

    try {
      let hiveClient = await HiveService.getHiveClient(session);

      if (!hiveClient) throw new HiveException('Unable to create Hive client');
      let userToken = hiveClient.getAccessToken();

      let newSession = JSON.parse(
        JSON.stringify({
          ...session,
          userToken,
          tutorialStep: 4,
          hiveHost: endpoint
        })
      );

      if (selected !== 'tuum' && endpoint !== process.env.REACT_APP_HIVE_HOST) {
        newSession.badges!.dStorage!.ownVault.archived = new Date().getTime();
      }
      let didService = await DidService.getInstance();
      if (selected !== 'document') {
        let document = await didService.getStoredDocument(new DID(session.did));
        let docBuilder = DIDDocument.Builder.newFromDocument(document);

        docBuilder.addService('#hiveVault', 'HiveVault', endpoint);
        let signedDocument = await docBuilder.seal(
          process.env.REACT_APP_APPLICATION_STORE_PASS as string
        );

        await didService.storeDocument(signedDocument);
        await didService.publishDocument(signedDocument);
        setDidDocument(signedDocument.toString(true));
      }
      let userService = new UserService(didService);
      const updatedSession = await userService.updateSession(newSession);
      setSession(updatedSession);
      if (hiveClient.isConnected()) {
        let vaultInfo = await hiveClient.VaultSubscription.checkSubscription();
        if (vaultInfo) {
        } else {
          await hiveClient.VaultSubscription.subscribe();
        }
      }
      await UserVaultScripts.Execute(hiveClient!);
      let blockchainDocument: DIDDocument = await didService.getPublishedDocument(
        new DID(session.did)
      );

      blockchainDocument.getCredentials().forEach(async vc => {
        await DidcredsService.addOrUpdateCredentialToVault(newSession, vc);
      });

      let activities = await ProfileService.getActivity(newSession);
      activities.push({
        guid: '',
        did: session!.did,
        message: 'You received a Beginner tutorial badge',
        read: false,
        createdAt: 0,
        updatedAt: 0
      });

      newSession.badges!.dStorage!.ownVault.archived &&
        activities.push({
          guid: '',
          did: session!.did,
          message: 'You received a Ownvault storage badge',
          read: false,
          createdAt: 0,
          updatedAt: 0
        });

      activities.forEach(async (activity: ActivityItem) => {
        await ProfileService.addActivity(activity, newSession);
      });
      window.localStorage.removeItem(
        `temporary_activities_${newSession.did.replace('did:elastos:', '')}`
      );
      // import education & experience profile
      let educations = JSON.parse(
        window.localStorage.getItem(
          `temp_educations_${newSession.did.replace('did:elastos:', '')}`
        ) || '[]'
      );
      let experiences = JSON.parse(
        window.localStorage.getItem(
          `temp_experiences_${newSession.did.replace('did:elastos:', '')}`
        ) || '[]'
      );

      if (educations.length > 0 || experiences.length > 0) {
        newSession = JSON.parse(JSON.stringify({ ...newSession }));
        newSession.badges!.account!.educationProfile.archived =
          educations.length > 0 ? new Date().getTime() : false;
        newSession.badges!.account!.experienceProfile.archived =
          experiences.length > 0 ? new Date().getTime() : false;
        const updatedSession = await userService.updateSession(newSession);
        setSession(updatedSession);
      }

      educations.forEach(
        async (educationItem: EducationItem, index: number) => {
          await ProfileService.updateEducationProfile(
            educationItem,
            newSession,
            !!index
          );
        }
      );
      experiences.forEach(
        async (experienceItem: ExperienceItem, index: number) => {
          await ProfileService.updateExperienceProfile(
            experienceItem,
            newSession,
            !!index
          );
        }
      );

      window.localStorage.removeItem(
        `temp_educations_${newSession.did.replace('did:elastos:', '')}`
      );
      window.localStorage.removeItem(
        `temp_experiences_${newSession.did.replace('did:elastos:', '')}`
      );

      props.onContinue(newSession);
    } catch (error) {
      await DidDocumentService.reloadUserDocument(session);
      setErrorMessage(
        'We are not able to process your request at moment. Please try again later. Exception: ' +
          error
      );
    }

    props.setLoading(false);
  };

  useEffect(() => {
    (async () => {
      let didService = await DidService.getInstance();
      setTuumHiveVersion(
        await HiveClient.getHiveVersion(
          process.env.REACT_APP_HIVE_HOST as string
        )
      );
      new Logger('TutorialStep2.useEffect').debug('DID: {}', session.did);
      let doc = await didService.getDidDocument(session.did);

      if (doc.getServices() && doc.getServices().length > 0) {
        setSelected('document');
        let serviceEndpoint = '';
        let hiveUrl = new DIDURL(session.did + '#hivevault');
        if (doc.services?.has(hiveUrl)) {
          serviceEndpoint = doc.services.get(hiveUrl).serviceEndpoint;
        } else {
          hiveUrl = new DIDURL(session.did + '#HiveVault');
          if (doc.services?.has(hiveUrl)) {
            serviceEndpoint = doc.services.get(hiveUrl).serviceEndpoint;
          }
        }
        if (serviceEndpoint) {
          setHiveDocument(serviceEndpoint);
        }
        setDetectedHiveVersion(
          await HiveClient.getHiveVersion(serviceEndpoint)
        );
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <h2>Decentralized Storage(Hive Vault)</h2>
      <p>
        You can choose to store all your personal and application data to your
        own storage as long as the storage is an Elastos Hive Node. By default,
        you are choosing to store your data on a vault provided by{' '}
        <b>Tuum Tech</b>. Or, you have the option to run your own Hive Node and
        be in complete control of your data! To learn more about how to run your
        own Hive Node, refer to{' '}
        <a
          href="https://github.com/elastos/Elastos.NET.Hive.Node"
          target="_blank"
          rel="noopener noreferrer"
        >
          Elastos Hive Node
        </a>
        .
      </p>

      <div className={style['tutorial-hive']}>
        <IonRadioGroup
          value={selected}
          onIonChange={e => {
            e.preventDefault();
            setSelected(e.detail.value!);
            e.cancelBubble = true;
          }}
        >
          {hiveDocument !== '' && (
            <div className={style['tutorial-hive-row']}>
              <IonRadio value="document"></IonRadio>

              <div className={style['tutorial-hive-item']}>
                <p>
                  <span className={style['tutorial-hive-item-title']}>
                    {hiveDocument}
                  </span>
                  <span className={style['tutorial-hive-item-description']}>
                    Using the default detected vault
                  </span>
                </p>
                <VersionTag>
                  <p>{detectedHiveVersion}</p>
                </VersionTag>
              </div>
            </div>
          )}

          {hiveDocument === '' && (
            <>
              <div className={style['tutorial-hive-row']}>
                <IonRadio value="tuum"></IonRadio>
                <div className={style['tutorial-hive-item']}>
                  <img alt="tuum logo" src={tuumlogo} />
                  <h2>Tuum Tech</h2>
                  <VersionTag>
                    <p>{tuumHiveVersion}</p>
                  </VersionTag>
                </div>
              </div>
              <div className={style['tutorial-hive-row']}>
                <IonRadio value="other"></IonRadio>
                <IonInput
                  disabled={selected !== 'other'}
                  value={hiveUrl}
                  onIonChange={e => {
                    setWarningRead(false);
                    e.preventDefault();
                    sethiveUrl(e.detail.value!);
                    e.cancelBubble = true;
                  }}
                  placeholder="Enter your vault url"
                ></IonInput>
              </div>
            </>
          )}
        </IonRadioGroup>
      </div>
      {errorMessage !== '' && (
        <div className={style['tutorial-step3-error']}>{errorMessage}</div>
      )}
      <IonButton onClick={saveSelection} className={style['tutorial-button']}>
        Continue
      </IonButton>
    </div>
  );
};

export default TutorialStep3Component;
