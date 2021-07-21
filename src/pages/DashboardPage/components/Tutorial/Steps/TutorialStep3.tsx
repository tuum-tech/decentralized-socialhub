/* eslint-disable no-useless-escape */
import { IonButton, IonInput, IonRadio, IonRadioGroup } from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { DidService } from 'src/services/did.service.new';
import { UserService } from 'src/services/user.service';
import { HiveService } from 'src/services/hive.service';
import { DidDocumentService } from 'src/services/diddocument.service';
import { ProfileService } from 'src/services/profile.service';
import { UserVaultScripts } from 'src/scripts/uservault.script';

import { connect } from 'react-redux';
import { InferMappedProps } from '../../../types';
import { setSession } from 'src/store/users/actions';

import style from '../style.module.scss';
import tuumlogo from '../../../../../assets/tuumtech.png';
import styled from 'styled-components';
import { DIDDocument } from '@elastosfoundation/did-js-sdk/';

const VersionTag = styled.span`
  color: green;
`;

interface ITutorialStepProp extends InferMappedProps {
  onContinue: () => void;
  setLoading?: (status: boolean) => void;
  session: ISessionItem;
}


const TutorialStep3Component: React.FC<ITutorialStepProp> = ({
  eProps,
  ...props
}) => {
  const { session } = props;
  const [hiveUrl, sethiveUrl] = useState('');
  const [hiveDocument, setHiveDocument] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [warningRead, setWarningRead] = useState(false);
  const [tuumHiveVersion, setTuumHiveVersion] = useState('');
  const [detectedHiveVersion, setDetectedHiveVersion] = useState('');
  const [selected, setSelected] = useState(
    hiveDocument === '' ? 'tuum' : 'document'
  );

  const getEndpoint = () => {
    if (selected === 'document') return hiveDocument;
    if (selected === 'tuum') return `${process.env.REACT_APP_TUUM_TECH_HIVE}`;
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
      setErrorMessage('Invalid hive address');
      return;
    }

    props.setLoading(true);
    let isValidHiveAddress = await HiveService.isHiveAddressValid(endpoint);
    if (!isValidHiveAddress) {
      props.setLoading(false);
      setErrorMessage('Invalid hive address');
      return;
    }

    if (!warningRead) {
      let hiveVersion = await HiveService.getHiveVersion(endpoint);

      if (!(await HiveService.isHiveVersionSet(hiveVersion))) {
        props.setLoading(false);
        setErrorMessage(
          `Hive version could not be verified. The supported versions are ${process.env.REACT_APP_HIVE_VALID_VERSION}. You may continue at your own discretion.`
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
            `Hive version ${hiveVersion} not supported. The supported versions are ${process.env.REACT_APP_HIVE_VALID_VERSION}`
          );
          return;
        }
      } catch (e) {
        props.setLoading(false);
        setErrorMessage(
          `Hive version could not be verified. The supported versions are ${process.env.REACT_APP_HIVE_VALID_VERSION}. You may continue at your own discretion.`
        );
        setWarningRead(true);
        return;
      }
    }

    try {
      let userToken = await generateUserToken(
        props.session.mnemonics,
        endpoint
      );
      let newSession = {
        ...session,
        userToken,
        tutorialStep: 4,
        hiveHost: endpoint
      };

      if (
        selected !== 'tuum' &&
        endpoint !== process.env.REACT_APP_TUUM_TECH_HIVE
      ) {
        newSession.badges!.dStorage!.ownVault.archived = new Date().getTime();
      }
      //TODO: Uncomment when update document publish is fixed
      // if (selected !== "document")
      // {
      //   let userDid = await didService.loadDid(props.session.mnemonics);
      //   //let hivesvc = didService.generateService(userDid, 'HiveVault', endpoint);
      //   //let documentState : IDIDDocumentState = await DidDocumentService.getUserDocument(props.session);

      //   let store = await DidService.getStore();
      //   let userDocument = await store.loadDid(userDid.did);
      //   let documentWithService = await didService.addServiceToDIDDocument(userDocument, userDid, 'HiveVault', endpoint);
      //   debugger;
      //   await DidDocumentService.publishUserDocument(userDocument, props.session);
      // }
      let userService = new UserService(new DidService());
      const updatedSession = await userService.updateSession(newSession);
      eProps.setSession({ session: updatedSession });

      let hiveInstance = await HiveService.getSessionInstance(newSession);
      if (hiveInstance && hiveInstance.isConnected) {
        await hiveInstance.Payment.CreateFreeVault();
      }
      await UserVaultScripts.Execute(hiveInstance!);
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

      props.onContinue();
    } catch (error) {
      await DidDocumentService.reloadUserDocument(props.session);
      setErrorMessage(
        'We are not able to process your request at moment. Please try again later'
      );
    }

    props.setLoading(false);
  };

  const generateUserToken = async (mnemonics: string, address: string) => {
    let challenge = await HiveService.getHiveChallenge(address);
    let didService = new DidService();
    let presentation = await didService.generateVerifiablePresentationFromUserMnemonics(
      mnemonics,
      '',
      challenge.issuer,
      challenge.nonce
    );
    const userToken = await HiveService.getUserHiveToken(address, presentation);

    return userToken;
  };

  let didService = new DidService();
  useEffect(() => {
    (async () => {
      setTuumHiveVersion(
        await HiveService.getHiveVersion(
          process.env.REACT_APP_TUUM_TECH_HIVE as string
        )
      );
      let doc = (await didService.getDidDocument(session.did)) as DIDDocument;

      if (doc.getServices() && doc.getServices().length > 0) {
        setSelected('document');
        setHiveDocument(doc.getServices()[0].endpoint);
        setDetectedHiveVersion(
          await HiveService.getHiveVersion(doc.getServices()[0].endpoint)
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
                <VersionTag>{detectedHiveVersion}</VersionTag>
              </div>
            </div>
          )}

          <div className={style['tutorial-hive-row']}>
            <IonRadio value="tuum"></IonRadio>
            <div className={style['tutorial-hive-item']}>
              <img alt="tuum logo" src={tuumlogo} />
              <h2>Tuum Tech</h2>
              <VersionTag>{tuumHiveVersion}</VersionTag>
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

export function mapDispatchToProps(dispatch: any) {
  return {
    eProps: {
      setSession: (props: { session: ISessionItem }) =>
        dispatch(setSession(props))
    }
  };
}

export default connect(null, mapDispatchToProps)(TutorialStep3Component);
